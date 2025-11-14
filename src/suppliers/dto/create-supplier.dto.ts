import { IsOptional, IsString, MaxLength } from "class-validator"

export class CreateSupplierDto {

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    cnpj: string

    @IsOptional()
    @IsString()
    phone: string

    @IsOptional()
    @IsString()
    email: string

    @IsOptional()
    @IsString()
    @MaxLength(300)
    address: string
}
