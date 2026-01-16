import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { MovementType } from "../entities/inventory_movement.entity";

export class CreateInventoryMovementDto {
    
    @IsString()
    product_id: string;

    @IsEnum(MovementType)
    type: MovementType;

    @IsNumber()
    quantity: number;

    @IsDateString()
    date_movement: Date;

    @IsString()
    @IsOptional()
    @MaxLength(1000)
    observation: string;
}
