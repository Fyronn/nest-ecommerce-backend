import { IsDecimal, IsEnum, IsInt, IsNumber, IsOptional, IsString, maxLength, MaxLength, Min, MinLength } from 'class-validator';
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


export class createBrandDto {

  @MinLength(2)
  @IsString() 
  name:string
}

export class createModelDto {
  @IsString() 
  @MinLength(2) 
  modelName:string

}

export class createYearDto {
  @IsInt()
  yearName:number
}

export class createEngineDto {
  @IsString()  code:string
  @IsOptional() @IsString() @MaxLength(10) fuel?:string
  @IsOptional() @IsInt()  displacement?:number
  @IsOptional() @IsInt()  hp?:number
  @IsOptional() @IsString()  transmission?:string
}


export class createAllDto extends createEngineDto {
  @MinLength(2) @IsString() brandName:string
  @IsString()  @MinLength(2) modelName:string
  @IsInt() yearName:number

}
