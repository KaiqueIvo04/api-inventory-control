import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { In } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './products.repository';
import { Filter } from 'src/shared/apply-filters';
import { Sort } from 'src/shared/sort';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductsRepository) { }

  async create(dto: CreateProductDto): Promise<Product> {
    if (dto.image_base64) {
      const sizeInBytes = Buffer.byteLength(dto.image_base64, 'utf8');
      const maxSize = 4 * 1024 * 1024; // 1MB

      if (sizeInBytes > maxSize) {
        throw new BadRequestException('Image exceeds 4MB!');
      }
      const valid = dto.image_base64.startsWith('data:image/');
      if (!valid) {
        throw new BadRequestException('Invalid image format!');
      }
    }

    const newProduct: Product = this.productRepository.create(dto);

    return await this.productRepository.save(newProduct);
  }

  async findAll(filter?: Filter, page?: number, limit?: number, sort?: Sort): Promise<[Product[], number]> {
    return await this.productRepository.filterAllPaginated(filter, page, limit, sort);
  }

  async findOne(filter: Filter): Promise<Product | null> {
    return await this.productRepository.filterOne(filter);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product | null> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) return;
    this.productRepository.merge(product, dto);
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<Product | null> {
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
