import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './domain/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuppliersModule } from './domain/suppliers/suppliers.module';
import { InventoryMovementsModule } from './domain/inventory_movements/inventory_movements.module';
import { SalesModule } from './domain/sales/sales.module';
import { AuthModule } from './domain/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { CustomLogger } from './custom.logger';

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
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot()  ],
  controllers: [AppController],
  exports: [CustomLogger],
  providers: [AppService, CustomLogger],
})
export class AppModule {}
