import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CatalogService } from './catalog.service';


@Controller('catalog')
export class CatalogController {
    constructor(private readonly s: CatalogService) { }

    @Get('brands')
    brands() {
        return this.s.brands()
    }

    @Get('brands/:brandId/models')
    models(@Param('brandId', ParseIntPipe) id: number) {
        return this.s.models(id)
    }

    @Get('models/:modelId/years')
    years(@Param('modelId',ParseIntPipe) id: number) {
        return this.s.years(id)
    }

    @Get('years/:yearId/engines')
    engines(@Param('yearId', ParseIntPipe) id: number) {
        return this.s.engines(id);
    }


}
