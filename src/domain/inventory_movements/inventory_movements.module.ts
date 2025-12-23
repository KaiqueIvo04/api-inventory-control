import { Module } from '@nestjs/common';
import { InventoryMovementsService } from './inventory_movements.service';
import { InventoryMovementsController } from './inventory_movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryMovement } from './entities/inventory_movement.entity';
import { ProductsModule } from 'src/domain/products/products.module';
import { InventoryMovementsRepository } from './inventory_movements.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryMovement]),
    ProductsModule,
  ],
  controllers: [InventoryMovementsController],
  providers: [InventoryMovementsService, InventoryMovementsRepository],
})
export class InventoryMovementsModule { }
