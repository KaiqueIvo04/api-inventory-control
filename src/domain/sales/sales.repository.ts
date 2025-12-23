import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/base-repository';
import { Sale } from './entities/sale.entity';

@Injectable()
export class SalesRepository extends BaseRepository<Sale> {
  constructor(dataSource: DataSource) {
    super(Sale, dataSource);
  }
}