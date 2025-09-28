import { Optional } from "@nestjs/common";
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { RegisterDto } from "src/auth/dto/auth.dto";
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
    @IsEmail() email:string
    @IsOptional() @IsString() @MinLength(6) @MaxLength(72) password?:string
    @IsOptional() @IsEnum(UserRole) role?:UserRole
}

export class CreateUserDto extends RegisterDto{
    @IsOptional() @IsEnum(UserRole) role?:UserRole
}

 