import { IsDecimal, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ProductType } from '@prisma/client';

export class CreateProductDto {
  @IsString() sku: string;
  @IsString() title: string;


  @IsDecimal()
  price: any;

  @IsOptional() @IsEnum(ProductType) type?: ProductType;
  @IsOptional() @IsInt() discDiameterMm?: number;
  @IsOptional() @IsInt() pressurePlateDiaMm?: number;
  @IsOptional() @IsInt() splineCount?: number;
  @IsOptional() @IsString() flywheelType?: string;
  @IsOptional() @IsString() material?: string;


}

export class UpdateProductDto {

  @IsOptional() @IsString() sku?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsDecimal() price?: any;
  @IsOptional() @IsEnum(ProductType) type?: ProductType;
  @IsOptional() @IsInt() discDiameterMm?: number;
  @IsOptional() @IsInt() pressurePlateDiaMm?: number;
  @IsOptional() @IsInt() splineCount?: number;
  @IsOptional() @IsString() flywheelType?: string;
  @IsOptional() @IsString() material?: string;
  @IsOptional() @IsString() imageUrl?: string;





}
