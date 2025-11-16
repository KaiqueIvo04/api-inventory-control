import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Repository, DataSource } from 'typeorm';
import { ItemOfSale } from './entities/item_of_sale.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SalesService {

  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(ItemOfSale)
    private readonly itemOfSaleRepository: Repository<ItemOfSale>,
    private readonly productService: ProductsService,
    private readonly dataSource: DataSource
  ) { }

  async create(dto: CreateSaleDto) {
    // Validações
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('The sale must at least 1 item');
    }

    const productIds = dto.items.map(item => item.product_id);
    const products = await this.productService.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products were not found!');
    }

    // Usa transaction para garantir consistência
    return await this.dataSource.transaction(async (manager) => {

      // Calcula o total da venda
      const total = dto.items.reduce((sum, item) => {
        return sum + (item.quantity * item.unit_price);
      }, 0) - (dto.discount || 0);

      // Cria a venda
      const newSale = manager.create(Sale, {
        name_client: dto.name_client,
        payment_method: dto.payment_method,
        total_value: total,  // Total já descontado
        discount: dto.discount, // Apenas para informar quanto já foi descontado
        date_sale: new Date()
      });

      const savedSale = await manager.save(Sale, newSale);

      // Cria os itens da venda
      const itemsToSave = dto.items.map(itemDto => {
        const product = products.find(p => p.id === itemDto.product_id);

        return manager.create(ItemOfSale, {
          sale_id: savedSale.id,
          product_id: itemDto.product_id,
          quantity: itemDto.quantity,
          unit_price: itemDto.unit_price,
          product_name_snapshot: product?.name
        });
      });

      await manager.save(ItemOfSale, itemsToSave);

      // TAtualiza estoque dos produtos
      for (const item of dto.items) {
        await this.updateProductInventory(item.product_id, -item.quantity, manager);
      }

      return this.saleRepository.findOne({
        where: { id: savedSale.id },
        relations: ['items', 'items.product']
      });
    });
  }

  findAll() {
    return this.saleRepository.find();
  }

  async findOne(id: string) {
    return this.saleRepository.findOneBy({ id })
  }

  async update(id: string, dto: UpdateSaleDto) {
    // Validações
    const sale = await this.saleRepository.findOneBy({ id });
    if (!sale) return null;
    this.saleRepository.merge(sale, dto);
    return this.saleRepository.save(sale);
  }

  async remove(id: string) {
    const sale = await this.saleRepository.findOneBy({ id });
    if (!sale) return null;
    return this.saleRepository.remove(sale);
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
