import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryMovementDto } from './dto/create-inventory_movement.dto';
import { InventoryMovement, MovementType } from './entities/inventory_movement.entity';
import { ProductsService } from 'src/domain/products/products.service';
import { InventoryMovementsRepository } from './inventory_movements.repository';
import { Filter } from 'src/shared/apply-filters';
import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Sort } from 'src/shared/sort';

@Injectable()
export class InventoryMovementsService {
  constructor(
    private readonly movementRepository: InventoryMovementsRepository,
    @Inject() private readonly productService: ProductsService,
    private readonly dataSource: DataSource
  ) { }

  async create(dto: CreateInventoryMovementDto): Promise<InventoryMovement> {
    const product = await this.productService.findOne(dto.product_id);
    if (!product) {
      throw new NotFoundException(`Update inventory: product with id ${dto.product_id} not found!`);
    }

    switch (dto.type) {
      case MovementType.SELL:
        throw new BadRequestException(
          'SELL movements must be created via sales endpoint.'
        );

      case MovementType.ADJUST:
        if (!dto.observation) {
          throw new BadRequestException('Adjustments require an observation.');
        }

        const oldQuantity = product.inventory_quantity;
        const finalQuantity = dto.quantity;
        const diff = finalQuantity - oldQuantity;

        product.inventory_quantity = finalQuantity;
        dto.quantity = diff; // movimento registra a diferença
        break;

      case MovementType.BUY:
        if (dto.quantity <= 0) throw new BadRequestException("The quantity of product must be greater than 0!");
        product.inventory_quantity += dto.quantity;
        break;

    }

    if (product.inventory_quantity < 0) {
      throw new BadRequestException(
        `Insufficient inventory quantities for the product ${product.name}!`
      );
    }

    return await this.dataSource.transaction(async (manager) => {
      await manager.save(Product, product);
      const newMovement = manager.create(InventoryMovement, dto);
      return manager.save(InventoryMovement, newMovement);
    })
  }

  async findAll(filter?: Filter, page?: number, limit?: number, sort?: Sort): Promise<[InventoryMovement[], number]> {
    return await this.movementRepository.filterAllPaginated(filter, page, limit, sort);
  }

  async findOne(id: string): Promise<InventoryMovement | null> {
    return await this.movementRepository.findOneBy({ id })
  }
}
