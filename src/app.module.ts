import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersModule } from './suppliers/suppliers.module';
import { InventoryMovementsModule } from './inventory_movements/inventory_movements.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'inventoryControl.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js'],
      autoLoadEntities: true,
      synchronize: true, // Uses only development environment,
      logging: true,
    }),
    ProductsModule,
    SuppliersModule,
    InventoryMovementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
