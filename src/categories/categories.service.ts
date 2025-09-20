import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CategoriesService {

    constructor(private prisma: PrismaService) {}

    getCategories() {
        return this.prisma.category.findMany({
            orderBy:{name:'asc'},
            select: { id: true, name: true, slug: true },
            

        })
    }


}
