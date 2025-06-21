import { Controller, Get, Query } from '@nestjs/common';
import { ScryfallService } from './scryfall.service';

@Controller('scryfall')
export class ScryfallController {
  constructor(private readonly scryfallService: ScryfallService) {}

  @Get('search')
  async search(@Query('text') text: string) {
    return this.scryfallService.search(text);
  }

  @Get('prints')
  async prints(@Query('id') id: string) {
    return this.scryfallService.getPrints(id);
  }
}
