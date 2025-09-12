import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    try {
      return await this.prisma.product.create({ data });
    } catch (e) {
      if (e.code === 'P2002') throw new ConflictException('SKU already exists'); 
      throw e;
    }
  }

  async update(id: number, data: any) {
    try {
      return await this.prisma.product.update({ where: { id }, data });
    } catch (e) {
      if (e.code === 'P2025') throw new NotFoundException('Belirtilen ürün bulunamadı'); 
      if (e.code === 'P2002') throw new ConflictException('SKU already exists');
      throw e;
    }
  }

  async disable(id: number) {
    
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async attachCategories(id: number, categoryIds: number[]) {
    
    return this.prisma.$transaction([
      this.prisma.productCategoryMap.deleteMany({ where: { productId: id } }),
      this.prisma.productCategoryMap.createMany({
        data: categoryIds.map((cid) => ({ productId: id, categoryId: cid })),
      }),
    ]);
  }

  async attachCompatibilities(id: number, engineIds: number[]) {
    return this.prisma.$transaction([
      this.prisma.productCompatibility.deleteMany({ where: { productId: id } }),
      this.prisma.productCompatibility.createMany({
        data: engineIds.map((eid) => ({ productId: id, engineId: eid })),
      }),
    ]);
  }
}
