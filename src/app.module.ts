import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CatalogModule } from './catalog/catalog.module';
import { ProductsModule } from './products/products.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    FavoritesModule,
    CatalogModule,
    ProductsModule,
    CatalogModule,
    PrismaModule,
    AdminModule
  ],
})
export class AppModule {}
