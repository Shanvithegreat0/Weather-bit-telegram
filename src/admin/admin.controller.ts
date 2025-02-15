import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { WeatherBotService } from '../weather-bot/weather-bot.service'; // ✅ Import WeatherBotService



const subscribersFile = path.join(__dirname, '../../subscribers.json');

@Controller('admin')
export class AdminController {
 constructor(private readonly botService: WeatherBotService) {}
  @Get('users')
  getUsers() {
    if (!fs.existsSync(subscribersFile)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(subscribersFile, 'utf-8'));
  }

  @Post('add-user')
  addUser(@Body('chatId') chatId: number) {
    let subscribers = this.getUsers();
    if (!subscribers.includes(chatId)) {
      subscribers.push(chatId);
      fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
      return { success: true };
    }
    return { success: false, message: 'User already exists' };
  }
  async addCommand(@Body('command') command: string, @Body('response') response: string) {
    this.botService.bot.command(command, (ctx) => ctx.reply(response));
    return { success: true };
  }

  @Delete('remove-user')
  async deleteCommand(@Body('command') command: string) {
    this.botService.bot.telegram.deleteMyCommands();
    return { success: true };
  }
  removeUser(@Body('chatId') chatId: number) {
    let subscribers = this.getUsers();
    subscribers = subscribers.filter(id => id !== chatId);
    fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
    return { success: true };
  }
  
}
