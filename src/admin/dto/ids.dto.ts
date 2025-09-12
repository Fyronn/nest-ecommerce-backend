
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class IdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => (Array.isArray(value) ? value.map((v:any)=>Number(v)) : []))
  @IsInt({ each: true })
  ids: number[];
}
