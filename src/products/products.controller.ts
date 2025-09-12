import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ListProductsDto } from './dto/list-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly s: ProductsService) {}

  @Get()
  list(@Query() q: ListProductsDto) {
    return this.s.list(q);
  }

  @Get(':id')
  byId(@Param('id', ParseIntPipe) id: number) {
    return this.s.byId(id);
  }
}
