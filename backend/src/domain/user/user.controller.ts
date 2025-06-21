import { Controller, Post, Body, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
