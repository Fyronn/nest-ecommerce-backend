import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { create } from 'domain';

@Injectable()
export class FavoritesService {
    constructor(private prisma: PrismaService) { }

    add(userId: number, productId: number) {

        return this.prisma.favorite.upsert({
            where: { userId_productId: { userId, productId } },
            update: {},
            create: { userId, productId },
        });



    }

    remove(userId:number,productId:number) {

        return this.prisma.favorite.delete({
            where : {userId_productId : {userId,productId}},
        })

    }

    listmine(userId:number){

        return this.prisma.favorite.findMany({
            where: {userId},
            include: {product:true},
            orderBy: {createdAt:'desc'}

        })


    }



















}
