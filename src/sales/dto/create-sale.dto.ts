import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, ValidateNested } from "class-validator";
import { PaymentMethod } from "../entities/sale.entity";
import { Type } from "class-transformer";

// DTO para cada item da venda
export class CreateItemOfSaleDto {
    @IsString()
    @IsNotEmpty()
    product_id: string;

    @IsNumber()
    @Min(1, { message: 'The minimum quantity of product is 1!' })
    quantity: number;

    // @IsNumber()
    // @IsPositive({ message: 'Unit price of product must be positive!' })
    // unit_price: number;
}

// DTO principal para criar a venda
export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  name_client: string;

  @IsEnum(PaymentMethod, { message: 'Invalid payment method!' })
  payment_method: PaymentMethod;

  // Array de itens da venda
  @IsArray({ message: 'Items must be array!' })
  @ValidateNested({ each: true })
  @Type(() => CreateItemOfSaleDto)
  items: CreateItemOfSaleDto[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;
}