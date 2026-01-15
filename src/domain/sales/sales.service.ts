import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { DataSource } from 'typeorm';
import { ItemOfSale } from './entities/item_of_sale.entity';
import { Product } from 'src/domain/products/entities/product.entity';
import { ProductsService } from 'src/domain/products/products.service';
import { InventoryMovement, MovementType } from '../inventory_movements/entities/inventory_movement.entity';
import { SalesRepository } from './sales.repository';
import { Filter } from 'src/shared/apply-filters';
import { Sort } from 'src/shared/sort';

@Injectable()
export class SalesService {
  constructor(
    private readonly saleRepository: SalesRepository,
    private readonly productService: ProductsService,
    private readonly dataSource: DataSource
  ) { }

  async create(dto: CreateSaleDto): Promise<Sale> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('The sale must have at least 1 item!');
    }

    const productIds = dto.items.map(i => i.product_id);
    const products = await this.productService.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products were not found!');
    }

    return this.dataSource.transaction(async manager => {
      // 1. Validar estoque
      for (const item of dto.items) {
        const product = products.find(p => p.id === item.product_id)!;
        if (item.quantity > product.inventory_quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}!`
          );
        }
      }

      // 2. Calcular total
      const subtotal = dto.items.reduce((sum, item) => {
        const product = products.find(p => p.id === item.product_id)!;
        return sum + product.price * item.quantity;
      }, 0);

      if (dto.discount && dto.discount > subtotal) {
        throw new BadRequestException('Discount exceeds subtotal!');
      }

      const total = subtotal - (dto.discount || 0);

      // 3. Criar venda
      const sale = manager.create(Sale, {
        name_client: dto.name_client,
        payment_method: dto.payment_method,
        discount: dto.discount || 0,
        total_value: total,
        date_sale: new Date(),
      });

      const savedSale = await manager.save(Sale, sale);

      // 4. Criar itens + movimentações + atualizar estoque
      for (const item of dto.items) {
        const product = products.find(p => p.id === item.product_id)!;

        // Item da venda
        await manager.save(
          manager.create(ItemOfSale, {
            sale_id: savedSale.id,
            product_id: product.id,
            quantity: item.quantity,
            unit_price: product.price,
            product_name_snapshot: product.name,
          })
        );

        // Atualizar estoque
        product.inventory_quantity -= item.quantity;
        if (product.inventory_quantity < 0) throw new BadRequestException(`Insufficient stock for ${product.name}!`)
        await manager.save(Product, product);

        // Criar movimentação SELL
        await manager.save(
          manager.create(InventoryMovement, {
            product_id: product.id,
            type: MovementType.SELL,
            quantity: item.quantity,
            date_movement: new Date(),
            observation: `Venda: ${savedSale.id}`,
            sale_id: savedSale.id,
          })
        );
      }

      return this.saleRepository.findOne({
        where: { id: savedSale.id },
        relations: ['items', 'items.product'],
      });
    });
  }

  findAll(filter?: Filter, page?: number, limit?: number, sort?: Sort): Promise<[Sale[], number]> {
    return this.saleRepository.filterAllPaginated(filter, page, limit, sort);
  }

  findOne(id: string) {
    return this.saleRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
  }

  async remove(id: string): Promise<Sale> {
    return this.dataSource.transaction(async manager => {
      const sale = await manager.findOne(Sale, {
        where: { id },
        relations: ['items'],
      });

      if (!sale) {
        throw new NotFoundException(`Sale with id ${id} not found`);
      }

      for (const item of sale.items) {
        const product = await manager.findOne(Product, {
          where: { id: item.product_id },
        });

        if (product) {
          // Produto ainda existe → repõe estoque
          await manager.increment(
            Product,
            { id: product.id },
            'inventory_quantity',
            item.quantity
          );
        }

        // Sempre registra a movimentação
        await manager.save(
          manager.create(InventoryMovement, {
            product_id: item.product_id,
            type: MovementType.ADJUST,
            quantity: item.quantity,
            date_movement: new Date(),
            observation: product
              ? `Estorno da venda ${sale.id}`
              : `Estorno da venda ${sale.id} (produto removido)`,
            sale_id: sale.id,
          })
        );
      }

      await manager.delete(ItemOfSale, { sale_id: sale.id });
      await manager.remove(Sale, sale);

      return sale;
    });
  }

}
