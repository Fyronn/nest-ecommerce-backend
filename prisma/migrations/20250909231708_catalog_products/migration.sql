-- CreateEnum
CREATE TYPE "public"."ProductType" AS ENUM ('CLUTCH_KIT', 'DISC', 'PRESSURE_PLATE', 'RELEASE_BEARING', 'FLYWHEEL', 'HYDRAULIC_KIT');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "discDiameterMm" INTEGER,
ADD COLUMN     "flywheelType" TEXT,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "pressurePlateDiaMm" INTEGER,
ADD COLUMN     "splineCount" INTEGER,
ADD COLUMN     "type" "public"."ProductType" NOT NULL DEFAULT 'CLUTCH_KIT';

-- CreateTable
CREATE TABLE "public"."Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VehicleModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brandId" INTEGER NOT NULL,

    CONSTRAINT "VehicleModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VehicleYear" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "modelId" INTEGER NOT NULL,

    CONSTRAINT "VehicleYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EngineSpec" (
    "id" SERIAL NOT NULL,
    "vehicleYearId" INTEGER NOT NULL,
    "code" TEXT,
    "fuel" TEXT,
    "displacement" INTEGER,
    "hp" INTEGER,
    "transmission" TEXT,

    CONSTRAINT "EngineSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductCompatibility" (
    "productId" INTEGER NOT NULL,
    "engineId" INTEGER NOT NULL,

    CONSTRAINT "ProductCompatibility_pkey" PRIMARY KEY ("productId","engineId")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductCategoryMap" (
    "productId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "ProductCategoryMap_pkey" PRIMARY KEY ("productId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "public"."Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleModel_brandId_name_key" ON "public"."VehicleModel"("brandId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleYear_modelId_year_key" ON "public"."VehicleYear"("modelId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "public"."Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_parentId_name_key" ON "public"."Category"("parentId", "name");

-- AddForeignKey
ALTER TABLE "public"."VehicleModel" ADD CONSTRAINT "VehicleModel_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VehicleYear" ADD CONSTRAINT "VehicleYear_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "public"."VehicleModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EngineSpec" ADD CONSTRAINT "EngineSpec_vehicleYearId_fkey" FOREIGN KEY ("vehicleYearId") REFERENCES "public"."VehicleYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCompatibility" ADD CONSTRAINT "ProductCompatibility_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCompatibility" ADD CONSTRAINT "ProductCompatibility_engineId_fkey" FOREIGN KEY ("engineId") REFERENCES "public"."EngineSpec"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCategoryMap" ADD CONSTRAINT "ProductCategoryMap_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductCategoryMap" ADD CONSTRAINT "ProductCategoryMap_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
