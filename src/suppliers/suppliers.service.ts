import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier) private readonly supplierRepository: Repository<Supplier>
  ) { }

  create(dto: CreateSupplierDto) {
    const newSupplier: Supplier = this.supplierRepository.create(dto);

    return this.supplierRepository.save(newSupplier);
  }

  findAll() {
    return this.supplierRepository.find();
  }

  async findOne(id: string) {
    return await this.supplierRepository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateSupplierDto) {
    const supplier: Supplier | null = await this.supplierRepository.findOneBy({ id });
    if (!supplier) return null;
    this.supplierRepository.merge(supplier, dto);
    return this.supplierRepository.save(supplier);
  }

  async remove(id: string) {
    const supplier: Supplier | null = await this.supplierRepository.findOneBy({ id });
    if (!supplier) return null;
    return this.supplierRepository.remove(supplier);
  }
}
