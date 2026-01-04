import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';
import { DataSource } from 'typeorm';
import { ItemOfSale } from './entities/item_of_sale.entity';
import { Product } from 'src/domain/products/entities/product.entity';
import { ProductsService } from 'src/domain/products/products.service';
import { Filter } from 'src/shared/apply-filters';
import { SalesRepository } from './sales.repository';

@Injectable()
export class SalesService {

  constructor(
    private readonly saleRepository: SalesRepository,
    private readonly productService: ProductsService,
    private readonly dataSource: DataSource
  ) { }

  async create(dto: CreateSaleDto): Promise<Sale>  {
    // 1. Validar items
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('The sale must have at least 1 item!');
    }

    const productIds = dto.items.map(item => item.product_id);
    const products = await this.productService.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products were not found!');
    }

    // 1.1 Validar disponibilidade de estoque
    for (const itemDto of dto.items) {
      const product = products.find(p => p.id === itemDto.product_id);

      if (itemDto.quantity > product!.inventory_quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product!.name}". ` +
          `Available: ${product!.inventory_quantity}, Requested: ${itemDto.quantity}`
        );
      }
    }

    // 2. Criar venda e items de venda com segurança (transaction)
    return await this.dataSource.transaction(async (manager) => {

      // 2.1. Calcular e validar o total da venda
      const subtotal = dto.items.reduce((sum, itemDto) => {
        const product = products.find(p => p.id === itemDto.product_id);
        return sum + (itemDto.quantity * product!.price);
      }, 0);

      const total = subtotal - (dto.discount || 0);

      // Validação: Desconto não pode ser maior que o subtotal
      if (dto.discount && dto.discount > subtotal) {
        throw new BadRequestException(
          `Discount (R$ ${dto.discount}) cannot exceed subtotal (R$ ${subtotal})!`
        );
      }

      // Validação: Total não pode ser negativo
      if (total < 0) {
        throw new BadRequestException('Sale total cannot be negative!');
      }

      // 2.2. Criar a venda 
      const newSale = manager.create(Sale, {
        name_client: dto.name_client,
        payment_method: dto.payment_method,
        total_value: total,  // Total já descontado
        discount: dto.discount, // Apenas para informar quanto já foi descontado
        date_sale: new Date()
      });

      const savedSale = await manager.save(Sale, newSale);

      // 2.3. Criar os itens da venda
      const itemsToSave = dto.items.map(itemDto => {
        const product = products.find(p => p.id === itemDto.product_id);

        return manager.create(ItemOfSale, {
          sale_id: savedSale.id,
          product_id: itemDto.product_id,
          quantity: itemDto.quantity,
          unit_price: product?.price,
          product_name_snapshot: product?.name
        });
      });

      await manager.save(ItemOfSale, itemsToSave);

      // 2.4. Atualizar estoque dos produtos vendidos
      for (const item of dto.items) {
        await this.updateProductInventory(item.product_id, -item.quantity, manager);
      }

      return this.saleRepository.findOne({
        where: { id: savedSale.id },
        relations: ['items', 'items.product']
      });
    });
  }

  findAll(filter?: Filter, page?: number, limit?: number): Promise<[Sale[], number]> {
    return this.saleRepository.filterAllPaginated(filter, page, limit);
  }

  async findOne(id: string): Promise<Sale | null> {
    return this.saleRepository.findOne({ where: { id }, relations: ['items', 'items.product'] })
  }

  async update(id: string, dto: UpdateSaleDto): Promise<Sale | null>  {
    // 1. Verificar se a venda a ser atualizada existe
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['items']
    });

    if (!sale) throw new NotFoundException(`Venda ${id} não encontrada`);

    // 2. Atualizar venda e itens
    return await this.dataSource.transaction(async (manager) => {
      if (dto.items && dto.items.length > 0) {

        // 2.1. Se tiver atualização de itens: Verificar se os itens passados existem
        const productIds = dto.items.map(item => item.product_id);
        const products = await this.productService.findByIds(productIds);

        if (products.length !== productIds.length) {
          throw new NotFoundException('One or more products were not found!');
        }

        // 2.2. Se tiver atualização de itens: Devolver estoque dos itens antigos e deletar do banco de dados
        for (const oldItem of sale.items) {
          await this.updateProductInventory(
            oldItem.product_id,
            oldItem.quantity,
            manager
          );

          await manager.remove(ItemOfSale, oldItem);
        }

        // 2.4. Se tiver atualização de itens: Calcular novo total
        const subtotal = dto.items.reduce((sum, itemDto) => {
          const product = products.find(p => p.id === itemDto.product_id);
          return sum + (itemDto.quantity * product!.price);
        }, 0);

        const total = subtotal - (dto.discount || 0);

        // 2.5. Se tiver atualização de itens: Atualizar dados da venda
        manager.merge(Sale, sale, {
          name_client: dto.name_client ?? sale.name_client,
          payment_method: dto.payment_method ?? sale.payment_method,
          discount: dto.discount ?? sale.discount,
          total_value: total
        });

        await manager.save(Sale, sale);

        // 2.6. Se tiver atualização de itens: Criar novos itens
        const newItems = dto.items.map(itemDto => {
          const product = products.find(p => p.id === itemDto.product_id);

          return manager.create(ItemOfSale, {
            sale_id: sale.id,
            product_id: itemDto.product_id,
            quantity: itemDto.quantity,
            unit_price: product?.price,
            product_name_snapshot: product?.name
          });
        });

        await manager.save(ItemOfSale, newItems);

        // 2.7. Se tiver atualização de itens: Descontar estoque dos novos itens
        for (const item of dto.items) {
          await this.updateProductInventory(item.product_id, -item.quantity, manager);
        }
      } else {
        // 2.1. Atualiza apenas dados da venda
        if (dto.discount) {
          const subtotal = sale.total_value + sale.discount
          if (dto.discount > subtotal) {
            throw new BadRequestException(
              `Discount (R$ ${dto.discount}) cannot exceed subtotal (R$ ${subtotal})!`
            );
          }

          const total = subtotal - dto.discount;
          manager.merge(Sale, sale, { ...dto, total_value: total });
        } else {
          manager.merge(Sale, sale, dto);
        }

        await manager.save(Sale, sale);
      }

      // Retorna venda atualizada com itens
      return this.saleRepository.findOne({
        where: { id: sale.id },
        relations: ['items', 'items.product']
      });
    });
  }

  async remove(id: string): Promise<Sale | null>  {
    const sale = await this.saleRepository.findOneBy({ id });
    if (!sale) return;
    return await this.saleRepository.remove(sale);
  }

  // HELPERS
  private async updateProductInventory(
    productId: string,
    quantityChange: number,
    manager: any
  ) {
    const product = await this.productService.findOne(productId);

    if (!product) {
      throw new NotFoundException(`Update inventory: product with id ${productId} not found!`);
    }

    product.inventory_quantity += quantityChange;

    if (product.inventory_quantity < 0) {
      throw new BadRequestException(
        `Insufficient inventory quantities for the product ${product.name}!`
      );
    }

    await manager.save(Product, product);
  }
}
