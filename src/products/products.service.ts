import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>
  ) { }

  create(dto: CreateProductDto) {
    const newProduct: Product = this.productRepository.create(dto);

    return this.productRepository.save(newProduct);
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    return await this.productRepository.findOneBy({ id })
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) return null;
    this.productRepository.merge(product, dto);
    return this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) return null;
    return this.productRepository.remove(product);
  }
}
