import { Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class FavoritesController {
  constructor(private readonly favs: FavoritesService) {}

  @Post('products/:productId/favorite')
  add(@Param('productId', ParseIntPipe) productId: number, @Req() req: any) {
    return this.favs.add(req.user.userId, productId);
  }

  @Delete('products/:productId/favorite')
  remove(@Param('productId', ParseIntPipe) productId: number, @Req() req: any) {
    return this.favs.remove(req.user.userId, productId);
  }

  @Get('me/favorites')
  mine(@Req() req: any) {
    return this.favs.listmine(req.user.userId);
  }
}
