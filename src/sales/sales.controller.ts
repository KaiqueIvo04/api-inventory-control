import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpCode } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sale = this.salesService.findOne(id);
    if (!sale) throw new NotFoundException();
    return sale;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto
  ) {
    const sale = await this.salesService.update(id, updateSaleDto);
    if (!sale) throw new NotFoundException();
    return sale;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const sale = await this.salesService.remove(id);
    if (!sale) throw new NotFoundException();
  }
}
