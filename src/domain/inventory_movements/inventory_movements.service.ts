import { Inject, Injectable} from '@nestjs/common';
import { CreateInventoryMovementDto } from './dto/create-inventory_movement.dto';
import { UpdateInventoryMovementDto } from './dto/update-inventory_movement.dto';
import { InventoryMovement } from './entities/inventory_movement.entity';
import { ProductsService } from 'src/domain/products/products.service';
import { InventoryMovementsRepository } from './inventory_movements.repository';
import { Filter } from 'src/shared/apply-filters';

@Injectable()
export class InventoryMovementsService {
  constructor(
    private readonly movementRepository: InventoryMovementsRepository,
    @Inject() private readonly productService: ProductsService
  ) { }

  async create(dto: CreateInventoryMovementDto): Promise<InventoryMovement> {
    const newInventoryMovement: InventoryMovement = this.movementRepository.create(dto);

    return await this.movementRepository.save(newInventoryMovement);
  }

  async findAll(filter?: Filter, page?: number, limit?: number): Promise<[InventoryMovement[], number]> {
    return await this.movementRepository.filterAllPaginated(filter, page, limit);
  }

  async findOne(id: string): Promise<InventoryMovement | null> {
    return await this.movementRepository.findOneBy({ id })
  }

  async update(id: string, dto: UpdateInventoryMovementDto): Promise<InventoryMovement | null> {
    const movement = await this.movementRepository.findOneBy({ id });
    if (!movement) return;
    this.movementRepository.merge(movement, dto);
    return await this.movementRepository.save(movement);
  }

  async remove(id: string): Promise<InventoryMovement | null> {
    const movement = await this.movementRepository.findOneBy({ id });
    if (!movement) return;
    return await this.movementRepository.remove(movement);
  }

  // // HELPERS
  // private async updateProductInventory(
  //   productId: string,
  //   quantityChange: number,
  //   manager: any
  // ) {
  //   const product = await this.productService.findOne(productId);

  //   if (!product) {
  //     throw new NotFoundException(`Update inventory: product with id ${productId} not found!`);
  //   }

  //   product.inventory_quantity += quantityChange;

  //   if (product.inventory_quantity < 0) {
  //     throw new BadRequestException(
  //       `Insufficient inventory quantities for the product ${product.name}!`
  //     );
  //   }

  //   await manager.save(Product, product);
  // }

}
