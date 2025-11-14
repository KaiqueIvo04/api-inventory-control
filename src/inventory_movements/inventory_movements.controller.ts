import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { InventoryMovementsService } from './inventory_movements.service';
import { CreateInventoryMovementDto } from './dto/create-inventory_movement.dto';
import { UpdateInventoryMovementDto } from './dto/update-inventory_movement.dto';

@Controller('inventory-movements')
export class InventoryMovementsController {
  constructor(private readonly inventoryMovementsService: InventoryMovementsService) {}

  @Post()
  create(@Body() createInventoryMovementDto: CreateInventoryMovementDto) {
    return this.inventoryMovementsService.create(createInventoryMovementDto);
  }

  @Get()
  findAll() {
    return this.inventoryMovementsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const movement = await this.inventoryMovementsService.findOne(id);
    if (!movement) throw new NotFoundException()
    return movement;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateInventoryMovementDto: UpdateInventoryMovementDto
  ) {
    const movement = await this.inventoryMovementsService.update(id, updateInventoryMovementDto);
    if (!movement) throw new NotFoundException()
    return movement;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const movement = await this.inventoryMovementsService.remove(id);
    if (!movement) throw new NotFoundException()
  }
}
