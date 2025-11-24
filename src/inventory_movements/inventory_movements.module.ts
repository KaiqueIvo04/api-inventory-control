import { Module } from '@nestjs/common';
import { InventoryMovementsService } from './inventory_movements.service';
import { InventoryMovementsController } from './inventory_movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryMovement } from './entities/inventory_movement.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryMovement]), ProductsModule],
  controllers: [InventoryMovementsController],
  providers: [InventoryMovementsService],
})
export class InventoryMovementsModule { }
