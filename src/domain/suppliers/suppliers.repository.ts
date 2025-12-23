import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/base-repository';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SuppliersRepository extends BaseRepository<Supplier> {
  constructor(dataSource: DataSource) {
    super(Supplier, dataSource);
  }
}