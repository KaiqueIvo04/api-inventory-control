import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { In } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './products.repository';
import { Filter } from 'src/shared/apply-filters';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductsRepository) { }

  async create(dto: CreateProductDto): Promise<Product> {
    const newProduct: Product = this.productRepository.create(dto);

    return await this.productRepository.save(newProduct);
  }

  async findAll(filter?: Filter, page?: number, limit?: number): Promise<[Product[], number]> {
    return await this.productRepository.filterAllPaginated(filter, page, limit);
  }

  async findOne(filter: Filter): Promise<Product | null> {
    return await this.productRepository.filterOne(filter);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) return;
    this.productRepository.merge(product, dto);
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) return;
    return await this.productRepository.remove(product);
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return await this.productRepository.findBy({
      id: In(ids)
    });
  }
}
