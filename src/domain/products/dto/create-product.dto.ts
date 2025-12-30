import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    Min,
    IsInt,
    MaxLength,
} from 'class-validator';

export class CreateProductDto {
    @IsOptional()
    @IsString()
    image_base64?: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsOptional()
    @IsString()
    supplier_id?: string;

    @IsNumber()
    @Min(0)
    cost: number;

    @IsNumber()
    @Min(0)
    price: number;

    @IsInt()
    @Min(0)
    inventory_quantity: number;

}
