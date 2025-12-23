import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/base-repository';
import { InventoryMovement } from './entities/inventory_movement.entity';

@Injectable()
export class InventoryMovementsRepository extends BaseRepository<InventoryMovement> {
  constructor(dataSource: DataSource) {
    super(InventoryMovement, dataSource);
  }
}