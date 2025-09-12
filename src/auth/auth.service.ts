import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const isEmailExists = await this.users.findByEmail(dto.email);
    if (isEmailExists) throw new BadRequestException('Talep ettiğiniz mail kullanımda');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create(dto.email, hash);

    
    return this.sign(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Bu kullanıcı sistemde tanımlı değil');

    const passRight = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passRight) throw new UnauthorizedException('Invalid credentials');

    return this.sign(user.id, user.email, user.role);
  }

  private sign(id: number, email: string, role: string) {
    const payload = { sub: id, email, role }; 
    return {
      access_token: this.jwt.sign(payload, { expiresIn: '7d' }),
    };
  }
}
