import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { ItemOfSale } from './entities/item_of_sale.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, ItemOfSale]), ProductsModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
