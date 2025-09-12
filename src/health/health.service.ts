import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.health.findMany({ orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const row = await this.prisma.health.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Health not found');
    return row;
  }

  create(note?: string) {
    return this.prisma.health.create({ data: { note: note ?? null } });
  }
}
