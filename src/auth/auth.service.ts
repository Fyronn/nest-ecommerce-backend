import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { error } from 'console';

@Injectable()
export class AuthService {
    constructor(private users: UsersService, private jwt: JwtService) { }


    async register(dto: RegisterDto) {

        const isemailexists = await this.users.findByEmail(dto.email)
        if (isemailexists) throw new BadRequestException('Talep ettiğiniz mail kullanımda')

        const hash = await bcrypt.hash(dto.password, 10)
        const user = this.users.create(dto.email, hash)

        return this.sign((await user).id, (await user).email)


    }


    async login(dto: LoginDto) {

        const isemailexists = await this.users.findByEmail(dto.email)
        if (!isemailexists) throw new UnauthorizedException('Bu kullanıcı sistemde tanımlı değil')

        const passright = bcrypt.compare(dto.password, isemailexists.passwordHash);
        if (!passright) throw new UnauthorizedException('Invalid credentials');

        return this.sign(isemailexists.id, isemailexists.email);




    }


    private sign(id: number, email: string) {
        const payload = { sub: id, email };
        return { access_token: this.jwt.sign(payload, { expiresIn: '7d' }) };
    }

}
