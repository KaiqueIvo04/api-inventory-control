import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersModule } from './suppliers/suppliers.module';
import { InventoryMovementsModule } from './inventory_movements/inventory_movements.module';
import { SalesModule } from './sales/sales.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

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
    SalesModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
