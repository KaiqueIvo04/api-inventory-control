import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {

    @IsString()
    name: string;

    @IsString()
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
