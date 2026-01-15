import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { Filter } from 'src/shared/apply-filters';
import { SuppliersRepository } from './suppliers.repository';
import { Sort } from 'src/shared/sort';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly supplierRepository: SuppliersRepository
  ) { }

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOneBy({ cnpj: dto.cnpj });
    if (supplier) throw new ConflictException("An supplier with that CNPJ already exists!");
    const newSupplier: Supplier = this.supplierRepository.create(dto);

    return await this.supplierRepository.save(newSupplier);
  }

  async findAll(filter?: Filter, page?: number, limit?: number, sort?: Sort): Promise<[Supplier[], number]> {
    return await this.supplierRepository.filterAllPaginated(filter, page, limit, sort);
  }

  async findOne(filter: Filter): Promise<Supplier | null> {
    return await this.supplierRepository.filterOne(filter);
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOneBy({ id });
    if (!supplier) return;
    this.supplierRepository.merge(supplier, dto);
    return await this.supplierRepository.save(supplier);
  }

  async remove(id: string): Promise<Supplier | null> {
    const supplier = await this.supplierRepository.findOneBy({ id });
    if (!supplier) return;
    return await this.supplierRepository.remove(supplier);
  }
}
