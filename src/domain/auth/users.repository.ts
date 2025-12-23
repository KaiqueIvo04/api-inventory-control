import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/base-repository';
import { Admin } from './entities/admin.entity';

@Injectable()
export class UsersRepository extends BaseRepository<Admin> {
  constructor(dataSource: DataSource) {
    super(Admin, dataSource);
  }
}