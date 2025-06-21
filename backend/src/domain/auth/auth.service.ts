import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ScryfallService } from '../scryfall/scryfall.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly scryfallService: ScryfallService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  // Utility to clean and format card names
  private static formatCardName(cardName: string): string {
    // Remove anything after /
    cardName = cardName.split('/')[0];
    // Remove special characters except letters and numbers
    cardName = cardName.replace(/[^a-zA-Z0-9 ]/g, '');
    // Capitalize all words
    cardName = cardName.replace(/\b\w/g, c => c.toUpperCase());
    // Remove spaces
    cardName = cardName.replace(/\s+/g, '');
    return cardName;
  }

  // Utility to generate a unique display name
  private async generateUniqueDisplayName(base: string, userId?: string): Promise<string> {
    let tries = 0;
    let displayName = '';
    let existing: any = null;
    do {
      const number = Math.floor(1000 + Math.random() * 9000).toString();
      displayName = `${base}#${number}`;
      existing = await this.userService.findByDisplayName(displayName);
      tries++;
    } while (existing && (!userId || String(existing._id) !== String(userId)) && tries < 10);
    return displayName;
  }

  async register(data: { email: string, password: string, displayName?: string }) {
    let displayName = data.displayName;
    if (!displayName) {
      let cardName = await this.scryfallService.getRandomCardName();
      cardName = AuthService.formatCardName(cardName);
      displayName = await this.generateUniqueDisplayName(cardName);
    }
    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.userService.create({
      email: data.email,
      passwordHash: hash,
      displayName,
      mainLanguage: 'en',
    });
    return this.login(user);
  }

  async updateDisplayName(userId: string, displayName?: string, random?: boolean) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    let newDisplayName: string;
    if (random || !displayName) {
      let cardName = await this.scryfallService.getRandomCardName();
      cardName = AuthService.formatCardName(cardName);
      newDisplayName = await this.generateUniqueDisplayName(cardName, userId);
    } else {
      // Parse numeric suffix from current displayName
      const match = user.displayName.match(/^(.*)#(\d{4})$/);
      let base = displayName;
      let number = match ? match[2] : (Math.floor(1000 + Math.random() * 9000)).toString();
      newDisplayName = `${base}#${number}`;
      // Check for collision
      const existing = await this.userService.findByDisplayName(newDisplayName);
      if (existing && String(existing._id) !== String(userId)) {
        newDisplayName = await this.generateUniqueDisplayName(base, userId);
      }
    }
    user.displayName = newDisplayName;
    await user.save();
    return { displayName: user.displayName };
  }

  async updateEmail(userId: string, email: string) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    user.email = email;
    await user.save();
    return { email: user.email };
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');
    const hash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hash;
    await user.save();
    return { success: true };
  }

  async getProfile(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return {
      email: user.email,
      displayName: user.displayName,
      mainLanguage: user.mainLanguage,
      profileImageUrl: user.profileImageUrl,
      lastLogin: user.lastLogin,
    };
  }

  async generateRandomDisplayName() {
    let cardName = await this.scryfallService.getRandomCardName();
    cardName = AuthService.formatCardName(cardName);
    const displayName = await this.generateUniqueDisplayName(cardName);
    return { displayName };
  }

  async patchMe(userId: string, body: { email?: string, displayName?: string, password?: string, currentPassword?: string }) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    let updated = false;
    if (body.displayName) {
      // Use utility to preserve numeric part and avoid collisions
      const match = user.displayName.match(/^(.*)#(\d{4})$/);
      let base = body.displayName;
      let number = match ? match[2] : (Math.floor(1000 + Math.random() * 9000)).toString();
      let newDisplayName = `${base}#${number}`;
      const existing = await this.userService.findByDisplayName(newDisplayName);
      if (existing && String(existing._id) !== String(userId)) {
        newDisplayName = await this.generateUniqueDisplayName(base, userId);
      }
      user.displayName = newDisplayName;
      updated = true;
    }
    if (body.email) {
      user.email = body.email;
      updated = true;
    }
    if (body.password) {
      if (!body.currentPassword) throw new UnauthorizedException('Current password is required to change password');
      const valid = await bcrypt.compare(body.currentPassword, user.passwordHash);
      if (!valid) throw new UnauthorizedException('Current password is incorrect');
      user.passwordHash = await bcrypt.hash(body.password, 10);
      updated = true;
    }
    if (updated) await user.save();
    return {
      email: user.email,
      displayName: user.displayName,
      mainLanguage: user.mainLanguage,
      profileImageUrl: user.profileImageUrl,
      lastLogin: user.lastLogin,
    };
  }
}
