import { Controller, Get, Query, Param, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ScryfallService } from './scryfall.service';

@Controller('scryfall')
export class ScryfallController {
  constructor(private readonly scryfallService: ScryfallService) {}

  @Get('autocomplete')
  async autocomplete(@Query('q') q: string) {
    return this.scryfallService.autocomplete(q);
  }

  @Get('search')
  async search(@Query('text') text: string) {
    return this.scryfallService.search(text);
  }

  @Get('card/:id')
  async getCardById(@Param('id') id: string) {
    try {
      return await this.scryfallService.getCardById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Card not found on Scryfall');
      }
      throw new InternalServerErrorException('Failed to fetch card from Scryfall');
    }
  }
}
