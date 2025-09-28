import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminProductsService {
  constructor(private prisma: PrismaService) { }

  async create(data: any) {
    try {
      return await this.prisma.product.create({ data });
    } catch (e) {
      if (e.code === 'P2002') throw new ConflictException('SKU already exists');
      throw e;
    }
  }


  //About Creating categories


  async createBrand(brandname: string) {
    try {
      return await this.prisma.brand.create({ data: { name: brandname } });
    } catch (e) {
      if (e.code === "P2002") {
        throw new BadRequestException('Bu marka zaten mecvut')
      }

      if (e.code === "P2020") {
        throw new BadRequestException('Girilen değer çok kısa')
      }

    }

  }

  async createModel(modelName: string, brandId: number) {
    try {
      return await this.prisma.vehicleModel.create({
        data: {
          name: modelName,
          brandId: brandId
        }
      })
    } catch (e) {

      if (e.code === "P2002") {
        throw new BadRequestException('Eklemek istediğiniz model zaten mevcut')
      }




    }

  }

  async createYear(year: number, modelId: number) {
     return this.prisma.vehicleYear.upsert({
    where: { modelId_year: { modelId, year } }, // şu anki durumun
    create: { modelId, year },
    update: {},
  });


  }

  async createEngine(year: number, code: string, fuel?: string, displacement?: number, hp?: number, transmission?: string) {
    try {
      return await this.prisma.engineSpec.create({
        data: {
          code: code,
          fuel: fuel,
          displacement: displacement,
          hp: hp,
          transmission: transmission,
          vehicleYearId: year

        }
      })
    } catch (e) {
      if (e.code === "P2002") {
        throw new BadRequestException('Bu motor zaten sistemde mevcut')
      }
    }
  }


  async createwithAll(brandname: string, modelName: string, year: number,
    code: string, fuel?: string, displacement?: number, hp?: number, transmission?: string) {

    return await this.prisma.$transaction(async (tx) => {

      const isBrandNameCurrent = await this.isBrandNameCurrent(brandname);
      const isModelNameCurrent = await this.isModelNameCurrent(modelName);
      
      const isEngineCodeCurrent = await this.isEngineCodeCurrent(code);



      let createdOrCurrentBrandId : number = 0;
      let createdOrCurrentModelId : number = 0;
      let createdOrCurrentEngineId: number = 0;
      let createdOrCurrentYearId  : number = 0;

      const isYearCurrent = await this.isYearCurrent(year,createdOrCurrentModelId);
      


      //brand


      if (isBrandNameCurrent) {

        const currentBrandId = await this.prisma.brand.findUnique({
          where: { name: brandname },

        })

        if(currentBrandId){
          createdOrCurrentBrandId = currentBrandId.id
        }

        
       
      }

      else {
        const createdBrandId = await this.createBrand(brandname)
        if(createdBrandId)
          createdOrCurrentBrandId = createdBrandId.id

      }

      //model


      if(isModelNameCurrent) {

        const currentModelId = await this.prisma.vehicleModel.findFirst({
          where:{name:modelName}
        })

        if(currentModelId){
          createdOrCurrentModelId = currentModelId.id
        }


      }
      else{


        const createdModelId = await this.createModel(modelName,createdOrCurrentBrandId)
        if(createdModelId){
          createdOrCurrentModelId = createdModelId.id
        }


      }

      //year

      /* const createdYearId = await this.createYear(year,createdOrCurrentModelId)
      if(createdYearId)
        createdOrCurrentYearId = createdYearId.id */


      if(isYearCurrent){

        const currentYearId =  await this.prisma.vehicleYear.findFirst({
          where:{year:year,modelId:createdOrCurrentModelId}
        })

        if(currentYearId){

          createdOrCurrentYearId = currentYearId.id

        }

      }
      else{

        const createdYearId = await this.createYear(year,createdOrCurrentModelId)
        if(createdYearId)
          createdOrCurrentYearId= createdYearId.id


      }



      //engine

      if(isEngineCodeCurrent){
        throw new BadRequestException('Bu motor kodu zaten sistemde mevcut')
      }
      else {
        this.createEngine(createdOrCurrentYearId,code,fuel,displacement,hp,transmission)
      }



    })


  }

  //--------------------------------------------------


  //Marka model yıl ve motor mecvudiyitet sorugulaması

  async isBrandNameCurrent(brandname: string): Promise<Boolean> {

    const iscurrent = await this.prisma.brand.count({
      where: { name: brandname }
    })

    return iscurrent > 0;

  }

  async isModelNameCurrent(modelName: string): Promise<Boolean> {

    const iscurrent = await this.prisma.vehicleModel.count({
      where: { name: modelName }

    })

    return iscurrent > 0;


  }

  async isYearCurrent(year: number , modelId:number): Promise<Boolean> {

    const iscurrent = await this.prisma.vehicleYear.count({
      where: { year: year , modelId:modelId },
      
    })

    return iscurrent > 0;



  }

  async isEngineCodeCurrent(code: string): Promise<Boolean> {

    const iscurrent = await this.prisma.engineSpec.count({
      where: { code: code }
    })

    return iscurrent > 0;

  }




  //-----------------------------------------------------------

  //Users adminstration 












  //---------------------------












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

  async getCombatIds(productId: number) {
    const rows = await this.prisma.productCompatibility.findMany({
      where: { productId },
      select: { engineId: true }

    });

    return rows.map(r => r.engineId);
  }

  async addCompatibilities(productId: number, engineIds: number[]) {
    if (!engineIds?.length) return { count: 0 };
    return this.prisma.productCompatibility.createMany({
      data: engineIds.map(engineId => ({ productId, engineId })),
      skipDuplicates: true,
    });
  }

  async removeCompatibilities(productId: number, engineIds: number[]) {
    if (!engineIds?.length) return { count: 0 };
    return this.prisma.productCompatibility.deleteMany({
      where: { productId, engineId: { in: engineIds } },
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
