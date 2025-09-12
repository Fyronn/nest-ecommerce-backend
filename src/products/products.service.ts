import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ListProductsDto } from './dto/list-products.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async list(q: ListProductsDto) {
    const {
      brandId, modelId, year, engineId, type, q: text,
      page = 1, pageSize = 24, sort = 'new',
    } = q;

    const AND: any[] = [{ isActive: true }];

    if (type) AND.push({ type });
    if (text) AND.push({ title: { contains: text, mode: 'insensitive' } });

    
    if (engineId) {
      AND.push({ compatibilities: { some: { engineId } } });
    }
    if (year) {
      AND.push({ compatibilities: { some: { engine: { vehicleYear: { year } } } } });
    }
    if (modelId) {
      AND.push({ compatibilities: { some: { engine: { vehicleYear: { modelId } } } } });
    }
    if (brandId) {
      AND.push({ compatibilities: { some: { engine: { vehicleYear: { model: { brandId } } } } } });
    }

    const where = { AND };

    let orderBy: Prisma.ProductOrderByWithRelationInput;

    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          sku: true,
          title: true,
          price: true,
          imageUrl: true,
          type: true,
          
          compatibilities: {
            take: 1,
            select: {
              engine: {
                select: {
                  vehicleYear: {
                    select: {
                      year: true,
                      model: {
                        select: {
                          name: true,
                          brand: { select: { name: true } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async byId(id: number) {
    const p = await this.prisma.product.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } }, 
        compatibilities: {
          include: {
            engine: {
              include: {
                vehicleYear: {
                  include: {
                    model: { include: { brand: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }
}
