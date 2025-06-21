import { Module } from '@nestjs/common';
import { ScryfallController } from './scryfall.controller';
import { ScryfallService } from './scryfall.service';

@Module({
  controllers: [ScryfallController],
  providers: [ScryfallService],
  exports: [ScryfallService],
})
export class ScryfallDomainModule {}
