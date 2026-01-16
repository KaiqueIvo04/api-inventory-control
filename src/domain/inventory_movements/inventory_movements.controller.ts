import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Query, UseInterceptors } from '@nestjs/common';
import { InventoryMovementsService } from './inventory_movements.service';
import { CreateInventoryMovementDto } from './dto/create-inventory_movement.dto';
import { JwtAuthGuard } from 'src/domain/auth/jwt-auth.guard';
import { Filter } from 'src/shared/apply-filters';
import { TotalCountInterceptor } from 'src/shared/interceptors/total-count.interceptor';
import { Sort } from 'src/shared/sort';

@Controller('inventory-movements')
export class InventoryMovementsController {
  constructor(private readonly inventoryMovementsService: InventoryMovementsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createInventoryMovementDto: CreateInventoryMovementDto,
    // @CurrentUser() user: CurrentUserDto // Obter usuário autenticado da requisição
  ) {
    return this.inventoryMovementsService.create(createInventoryMovementDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TotalCountInterceptor)
  findAll(
    @Query('filter') filter?: Filter,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: Sort
  ) {
    return this.inventoryMovementsService.findAll(filter, page, limit, sort);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const movement = await this.inventoryMovementsService.findOne(id);
    if (!movement) throw new NotFoundException()
    return movement;
  }
}
