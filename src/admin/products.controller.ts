import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { AdminProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { IdsDto } from './dto/ids.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN') 
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly s: AdminProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    
    return this.s.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.s.update(id, dto);
  }

  @Patch(':id/disable')
  disable(@Param('id', ParseIntPipe) id: number) {
    return this.s.disable(id);
  }

  @Post(':id/categories')
  setCategories(@Param('id', ParseIntPipe) id: number, @Body() body: IdsDto) {
    return this.s.attachCategories(id, body.ids ?? []);
  }

  @Post(':id/compatibilities')
  setCompat(@Param('id', ParseIntPipe) id: number, @Body() body: IdsDto) {
    return this.s.attachCompatibilities(id, body.ids ?? []);
  }
}
