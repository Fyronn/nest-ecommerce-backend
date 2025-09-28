import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma, UserRole } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminUsersService {
    constructor(private readonly prisma: PrismaService, private readonly authservice: AuthService, private readonly userservice: UsersService, private readonly jwt: JwtService) {

    }

    async get_AllUsers() {
        return this.prisma.user.findMany({
            orderBy: { email: 'asc' },
            select: { email: true, createdAt: true, role: true },
        });
    }

    async get_OneUser(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            select: { email: true, createdAt: true, role: true }
        })
    }

    async updateUser(id: number, dto: UpdateUserDto) {
        const data: Prisma.UserUpdateInput = {};

        if (dto.email) data.email = dto.email;

        if (dto.role) data.role = dto.role;

        if (dto.password) {
            const hash = await bcrypt.hash(dto.password, 10);
            data.passwordHash = hash;
        }

        return this.prisma.user.update({
            where: { id },
            data,
            select: { id: true, email: true, role: true, createdAt: true },
        });
    }

    async delete(id: number) {
        return this.prisma.user.delete({
            where: { id: id }
        })

    }

    async create(dto: CreateUserDto) {
        const isEmail = await this.userservice.findByEmail(dto.email);
        if (isEmail) throw new BadRequestException('Bu email ile bir kayıt zaten mevcut');

        const hash = await bcrypt.hash(dto.password, 10);

        const createdUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash: hash,
                role: dto.role
            }
        })

    }



}
