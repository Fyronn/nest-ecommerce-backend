import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, IsIn } from 'class-validator';
import { ProductType } from '@prisma/client';

const toNum = (v: any) => (v === undefined || v === null || v === '' ? undefined : Number(v));

export class ListProductsDto {
  @IsOptional() @Transform(({ value }) => toNum(value)) @IsInt() brandId?: number;
  @IsOptional() @Transform(({ value }) => toNum(value)) @IsInt() modelId?: number;
  @IsOptional() @Transform(({ value }) => toNum(value)) @IsInt() year?: number;
  @IsOptional() @Transform(({ value }) => toNum(value)) @IsInt() engineId?: number;

  @IsOptional() @IsEnum(ProductType) type?: ProductType;
  @IsOptional() @IsString() q?: string;

  @IsOptional() @Transform(({ value }) => toNum(value)) @IsPositive() page?: number;
  @IsOptional() @Transform(({ value }) => toNum(value)) @IsPositive() pageSize?: number;

  @IsOptional() @IsIn(['price_asc', 'price_desc', 'new']) sort?: 'price_asc'|'price_desc'|'new';
}
