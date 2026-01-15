import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpCode, UseGuards, Query, UseInterceptors } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { JwtAuthGuard } from 'src/domain/auth/jwt-auth.guard';
import { Filter } from 'src/shared/apply-filters';
import { TotalCountInterceptor } from 'src/shared/interceptors/total-count.interceptor';
import { Sort } from 'src/shared/sort';

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
  @UseInterceptors(TotalCountInterceptor)
  findAll(
    @Query('filter') filter?: Filter,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: Sort,
  ) {
    return this.salesService.findAll(filter, page, limit, sort);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const sale = this.salesService.findOne(id);
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
