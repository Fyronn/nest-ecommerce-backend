import { Module } from '@nestjs/common';
import { AdminProductsService } from './products.service';
import { AdminProductsController } from './products.controller';
import { UsersService } from 'src/users/users.service';
import { AdminUsersService } from './admin.user.service';
import { AdminUsersController } from './admin.user.controller';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { UsersController } from 'src/users/users.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';


@Module({

  imports: [
      UsersModule,
      JwtModule.register({
        secret: process.env.JWT_SECRET!,
        signOptions: { expiresIn: '7d' },
      }),
    ],




  providers: [AdminProductsService,UsersService,AdminUsersService,AuthService],
  controllers: [AdminProductsController,AdminUsersController,AuthController,UsersController],
})
export class AdminModule {}
