import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpCode, UseGuards, Query } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { JwtAuthGuard } from 'src/domain/auth/jwt-auth.guard';
import { Filter } from 'src/shared/apply-filters';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createSupplierDto: CreateSupplierDto,
    // @CurrentUser() user: CurrentUserDto // Obter usuário autenticado da requisição
  ) {
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('filter') filter?: Filter,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.suppliersService.findAll(filter, page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const supplier = await this.suppliersService.findOne(id);
    if (!supplier) throw new NotFoundException();
    return supplier;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)

  async update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.suppliersService.update(id, updateSupplierDto);
    if (!supplier) throw new NotFoundException();
    return supplier;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const supplier = await this.suppliersService.remove(id);
    if (!supplier) throw new NotFoundException();
  }
}
