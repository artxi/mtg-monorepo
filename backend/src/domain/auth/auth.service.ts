import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  async register(data: { email: string, password: string, displayName: string }) {
    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.userService.create({
      email: data.email,
      passwordHash: hash,
      displayName: data.displayName,
      mainLanguage: 'en',
    });
    return this.login(user);
  }
}
