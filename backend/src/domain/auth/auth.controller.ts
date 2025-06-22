import { Controller, Post, Body, UnauthorizedException, UsePipes, ValidationPipe, Put, Req, UseGuards, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: { email: string, password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('display-name')
  async updateDisplayName(@Req() req: Request, @Body() body: { displayName?: string, random?: boolean }) {
    return this.authService.updateDisplayName(req['user']['userId'], body.displayName, body.random);
  }

  @UseGuards(JwtAuthGuard)
  @Put('email')
  async updateEmail(@Req() req: Request, @Body() body: { email: string }) {
    return this.authService.updateEmail(req['user']['userId'], body.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('password')
  async updatePassword(@Req() req: Request, @Body() body: { currentPassword: string, newPassword: string }) {
    return this.authService.updatePassword(req['user']['userId'], body.currentPassword, body.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    return this.authService.getProfile(req['user']['userId']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('random-display-name')
  async getRandomDisplayName() {
    return this.authService.generateRandomDisplayName();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async patchMe(@Req() req: Request, @Body() body: { email?: string, displayName?: string, password?: string }) {
    return this.authService.patchMe(req['user']['userId'], body);
  }
}
