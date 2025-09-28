import { Get, Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { AdminProductsService } from './products.service';
import {createAllDto, createBrandDto, createEngineDto, createModelDto, CreateProductDto, createYearDto, UpdateProductDto } from './dto/product.dto';
import { IdsDto } from './dto/ids.dto';
import { UsersService } from '../users/users.service';
import { AdminUsersService } from './admin.user.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly s: AdminProductsService , private readonly AdminUserService:AdminUsersService) { }
  

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


  //About Creating categories

  @Post('/brands/add')
  addbrands(@Body() body: createBrandDto) {
    return this.s.createBrand(body.name);

  }

  @Post('/brands/:id/models/add')
  addModel(@Param('id', ParseIntPipe) id: number, @Body() body: createModelDto) {
    return this.s.createModel(body.modelName, id)

  }

  @Post('models/:id/years/add')
  addYear(@Param('id', ParseIntPipe) id: number, @Body() body: createYearDto) {
    return this.s.createYear(body.yearName, id);

  }

  @Post('years/:id/engines/add')
  addEngine(@Param('id', ParseIntPipe) id: number, @Body() body: createEngineDto) {
    return this.s.createEngine(id, body.code, body.fuel, body.displacement, body.hp, body.transmission)

  }




  //---------------------------

  //ALERT DANGEROUS ALL_ADD REQUEST FOR NOW ProductType

  @Post('add_all')
  add_all(@Body() body: createAllDto) {
    return this.s.createwithAll(body.brandName, body.modelName, body.yearName, body.code, body.fuel,
      body.displacement, body.hp ,body.transmission)

  }
  //



  @Get(':id/compatibilities')
  getCompatIds(@Param('id', ParseIntPipe) id: number) {
    return this.s.getCombatIds(id)
  }

  @Post(':id/compatibilities/add')
  addCompat(@Param('id', ParseIntPipe) id: number, @Body() body: IdsDto) {
    return this.s.addCompatibilities(id, body.ids ?? []);
  }


  @Post(':id/compatibilities/remove')
  removeCompat(@Param('id', ParseIntPipe) id: number, @Body() body: IdsDto) {
    return this.s.removeCompatibilities(id, body.ids ?? []);
  }




}
