import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpCode, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createSaleDto: CreateSaleDto,
    // @CurrentUser() user: CurrentUserDto // Obter usuário autenticado da requisição
  ) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const sale = this.salesService.findOne(id);
    if (!sale) throw new NotFoundException();
    return sale;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto
  ) {
    const sale = await this.salesService.update(id, updateSaleDto);
    if (!sale) throw new NotFoundException();
    return sale;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const sale = await this.salesService.remove(id);
    if (!sale) throw new NotFoundException();
  }
}
