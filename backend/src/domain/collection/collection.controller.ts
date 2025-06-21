import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionCard } from './collection-card.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCollectionCardDto } from './dto/create-collection-card.dto';

@Controller('collection')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  async findAll(@Req() req): Promise<CollectionCard[]> {
    const userId = req.user.userId;
    return this.collectionService.findAllByUser(userId);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Req() req, @Body() body: CreateCollectionCardDto) {
    const userId = req.user.userId;
    return this.collectionService.create(userId, body);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Req() req, @Param('id') id: string, @Body() body: Partial<CreateCollectionCardDto>) {
    const userId = req.user.userId;
    return this.collectionService.update(userId, id, body);
  }

  @Delete(':id')
  async delete(@Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.collectionService.delete(userId, id);
  }
}
