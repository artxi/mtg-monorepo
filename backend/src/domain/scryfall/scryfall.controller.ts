import { Controller, Get, Query } from '@nestjs/common';
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
}
