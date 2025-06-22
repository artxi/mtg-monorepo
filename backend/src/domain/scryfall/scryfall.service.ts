import { Injectable, InternalServerErrorException } from '@nestjs/common';
// @ts-ignore
import fetch from 'node-fetch';

@Injectable()
export class ScryfallService {
  public readonly SCRYFALL_API_BASE = process.env.SCRYFALL_API_BASE;

  async getRandomCardName(): Promise<string> {
    try {
      const url = `${this.SCRYFALL_API_BASE}/cards/random`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new InternalServerErrorException('Failed to fetch random card from Scryfall');
      }
      const data = await res.json();
      if (!data.name) {
        throw new InternalServerErrorException('Scryfall response missing card name');
      }
      return data.name as string;
    } catch (err) {
      throw new InternalServerErrorException('Could not fetch random card name from Scryfall');
    }
  }

  async search(text: string) {
    try {
      const url = `${this.SCRYFALL_API_BASE}/cards/search?q=${encodeURIComponent(text)}&unique=prints`;
      const res = await fetch(url);
      if (!res.ok) {
        // Scryfall returns 404 for no results, but that's not a server error
        if (res.status === 404) {
          return { data: [], object: 'list', total_cards: 0 };
        }
        throw new InternalServerErrorException('Failed to fetch from Scryfall');
      }
      const data = await res.json();
      return data;
    } catch (err) {
      throw new InternalServerErrorException('Could not search Scryfall');
    }
  }
}
