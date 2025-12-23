import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    name: string;

    @IsString()
    @MaxLength(1000)
    description: string;

    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    supplier_id: string;

    @IsNumber()
    cost: number;

    @IsNumber()
    price: number;

    @IsNumber()
    inventory_quantity: number;
}
