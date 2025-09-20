import {  Get, Controller } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma.service';


@Controller('categories')
export class CategoriesController {
 constructor (private readonly service:CategoriesService) {}

 @Get()
 getAllCategories () {
    return this.service.getCategories();
 }


}
