import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CatalogService {

    constructor(private prisma: PrismaService) { }


    brands() {
        return this.prisma.brand.findMany({
            orderBy: { name: 'asc' }
        })

    }

    async models(brandId: number) {
        await this.ensureBrand(brandId);
        return this.prisma.vehicleModel.findMany({
            where: { brandId },
            orderBy: { name: 'asc' }
        })
    }

    async years(modelId: number) {
        await this.ensureModel(modelId);
        return this.prisma.vehicleYear.findMany({
            where: { modelId },
            orderBy: { year: 'desc' },
        });
    }

    async engines(yearId: number) {
        await this.ensureYear(yearId);
        return this.prisma.engineSpec.findMany({
            where: { vehicleYearId: yearId },
            orderBy: { id: 'asc' },
        });
    }









    private async ensureBrand(id: number) {
        const ok = await this.prisma.brand.findUnique({ where: { id } });
        if (!ok) throw new NotFoundException('Brand not found');
    }
    private async ensureModel(id: number) {
        const ok = await this.prisma.vehicleModel.findUnique({ where: { id } });
        if (!ok) throw new NotFoundException('Model not found');
    }
    private async ensureYear(id: number) {
        const ok = await this.prisma.vehicleYear.findUnique({ where: { id } });
        if (!ok) throw new NotFoundException('Year not found');
    }











}
