import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpCode, UseGuards, } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createProductDto: CreateProductDto,
    // @CurrentUser() user: CurrentUserDto // Obter usuário autenticado da requisição
  ) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    const product = this.productsService.findOne(id);
    if (!product) throw new NotFoundException();
    return product;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);
    if (!product) throw new NotFoundException();
    return product;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const product = await this.productsService.remove(id);
    if (!product) throw new NotFoundException();
  }
}
