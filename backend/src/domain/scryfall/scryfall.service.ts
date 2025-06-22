import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
// @ts-ignore
import fetch from 'node-fetch';

@Injectable()
export class ScryfallService {
  public readonly SCRYFALL_API_BASE = process.env.SCRYFALL_API_BASE;

  async getRandomCardName(): Promise<string> {
    const url = `${this.SCRYFALL_API_BASE}/cards/random`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) {
        throw new NotFoundException('Random card not found on Scryfall');
      }
      throw new InternalServerErrorException('Failed to fetch random card from Scryfall');
    }
    const data = await res.json();
    if (!data.name) {
      throw new InternalServerErrorException('Scryfall response missing card name');
    }
    return data.name as string;
  }

  async autocomplete(query: string) {
    const url = `${this.SCRYFALL_API_BASE}/cards/autocomplete?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new InternalServerErrorException('Failed to fetch autocomplete from Scryfall');
    }
    return res.json();
  }

  async search(text: string) {
    const url = `${this.SCRYFALL_API_BASE}/cards/search?q=${encodeURIComponent(text)}&unique=prints`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) {
        // Scryfall returns 404 for no results, not a server error
        return { data: [], object: 'list', total_cards: 0 };
      }
      throw new InternalServerErrorException('Failed to fetch from Scryfall');
    }
    return res.json();
  }
}
