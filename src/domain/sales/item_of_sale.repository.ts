import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/base-repository';
import { ItemOfSale } from './entities/item_of_sale.entity';

@Injectable()
export class ItemOfSaleRepository extends BaseRepository<ItemOfSale> {
  constructor(dataSource: DataSource) {
    super(ItemOfSale, dataSource);
  }
}