import { Injectable } from '@nestjs/common';
import { CreateInventoryMovementDto } from './dto/create-inventory_movement.dto';
import { UpdateInventoryMovementDto } from './dto/update-inventory_movement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryMovement } from './entities/inventory_movement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InventoryMovementsService {
  constructor(
    @InjectRepository(InventoryMovement) private readonly movementRepository: Repository<InventoryMovement>
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
}
