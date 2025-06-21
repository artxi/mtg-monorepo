import { Injectable, InternalServerErrorException } from '@nestjs/common';
// @ts-ignore
import fetch from 'node-fetch';

@Injectable()
export class ScryfallService {
  public readonly SCRYFALL_API_BASE = process.env.SCRYFALL_API_BASE;

  async getRandomCardName(): Promise<string> {
    try {
      const url = this.SCRYFALL_API_BASE + '/cards/random';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch from Scryfall');
      const data = await res.json();
      return data.name as string;
    } catch (err) {
      throw new InternalServerErrorException('Could not fetch random card name from Scryfall');
    }
  }

  async search(text: string) {
    try {
      // Accept the raw text input and build the Scryfall query
      const url = `${this.SCRYFALL_API_BASE}/cards/search?q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch from Scryfall');
      const data = await res.json();
      return data;
    } catch (err) {
      throw new InternalServerErrorException('Could not search Scryfall');
    }
  }

  async getPrints(id: string) {
    try {
      const url = `${this.SCRYFALL_API_BASE}/cards/${id}/prints`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch from Scryfall');
      const data = await res.json();
      return data;
    } catch (err) {
      throw new InternalServerErrorException('Could not fetch Scryfall prints');
    }
  }
}
