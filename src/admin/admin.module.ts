import { Module } from '@nestjs/common';
import { AdminProductsService } from './products.service';
import { AdminProductsController } from './products.controller';

@Module({
  providers: [AdminProductsService],
  controllers: [AdminProductsController],
})
export class AdminModule {}
