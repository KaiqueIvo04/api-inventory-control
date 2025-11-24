import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryMovementDto } from './dto/create-inventory_movement.dto';
import { UpdateInventoryMovementDto } from './dto/update-inventory_movement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryMovement } from './entities/inventory_movement.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class InventoryMovementsService {
  constructor(
    @InjectRepository(InventoryMovement) private readonly movementRepository: Repository<InventoryMovement>,
    @Inject() private readonly productService: ProductsService
  ) { }

  create(dto: CreateInventoryMovementDto) {
    const newInventoryMovement: InventoryMovement = this.movementRepository.create(dto);

    return this.movementRepository.save(newInventoryMovement);
  }

  findAll() {
    return this.movementRepository.find();
  }

  async findOne(id: string) {
    return await this.movementRepository.findOneBy({ id })
  }

  async update(id: string, dto: UpdateInventoryMovementDto) {
    const movement = await this.movementRepository.findOneBy({ id });
    if (!movement) return null;
    this.movementRepository.merge(movement, dto);
    return this.movementRepository.save(movement);
  }

  async remove(id: string) {
    const movement = await this.movementRepository.findOneBy({ id });
    if (!movement) return null;
    return this.movementRepository.remove(movement);
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
