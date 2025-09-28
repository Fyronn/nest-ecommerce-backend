import { Get, Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { AdminUsersService } from './admin.user.service';
import {  CreateUserDto, UpdateUserDto } from './dto/user.dto';


@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/users')
export class AdminUsersController {
    constructor(private readonly AdminUserService: AdminUsersService) { }



    @Get()
    get_Users() {
        return this.AdminUserService.get_AllUsers()
    }

    @Get(':id')
    get_OneUser(@Param('id', ParseIntPipe) id: number) {
        return this.AdminUserService.get_OneUser(id)
    }


    @Patch(':id')
    update(@Body() body:UpdateUserDto,  @Param('id',ParseIntPipe) id:number,){
        return this.AdminUserService.updateUser(id,body)
    }

    @Delete(':id')
    delete(@Param('id',ParseIntPipe) id:number){
        return this.AdminUserService.delete(id)
    }

    @Post()
    create_user(@Body() body:CreateUserDto){
        this.AdminUserService.create(body);

    }






}