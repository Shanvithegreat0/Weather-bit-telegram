import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminService {
  private readonly adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // Set a secure password

  login(password: string): boolean {
    if (password === this.adminPassword) {
      return true;
    }
    throw new UnauthorizedException('Invalid password');
  }
}
