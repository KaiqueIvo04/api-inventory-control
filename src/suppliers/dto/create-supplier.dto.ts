import { IsOptional, IsString } from "class-validator"

export class CreateSupplierDto {

    @IsString()
    id: string

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
    address: string
}
