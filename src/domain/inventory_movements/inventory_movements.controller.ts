import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Query } from '@nestjs/common';
import { InventoryMovementsService } from './inventory_movements.service';
import { CreateInventoryMovementDto } from './dto/create-inventory_movement.dto';
import { UpdateInventoryMovementDto } from './dto/update-inventory_movement.dto';
import { JwtAuthGuard } from 'src/domain/auth/jwt-auth.guard';
import { Filter } from 'src/shared/apply-filters';

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
  findAll(
    @Query('filter') filter?: Filter,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.inventoryMovementsService.findAll(filter, page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const movement = await this.inventoryMovementsService.findOne(id);
    if (!movement) throw new NotFoundException()
    return movement;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateInventoryMovementDto: UpdateInventoryMovementDto
  ) {
    const movement = await this.inventoryMovementsService.update(id, updateInventoryMovementDto);
    if (!movement) throw new NotFoundException()
    return movement;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    const movement = await this.inventoryMovementsService.remove(id);
    if (!movement) throw new NotFoundException()
  }
}
