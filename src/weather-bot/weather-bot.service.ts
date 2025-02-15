import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';


dotenv.config();

@Injectable()
export class WeatherBotService implements OnModuleInit {
  public bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN || '');
  }

  async onModuleInit() {
    this.bot.start((ctx) => ctx.reply('Welcome! Send me a state name to get the weather forecast.'));
    
    this.bot.command('subscribe', (ctx) => {
      const chatId = ctx.chat.id;
      let subscribers = this.getSubscribers();
  
      if (!subscribers.includes(chatId)) {
        subscribers.push(chatId);
        this.saveSubscribers(subscribers);
        ctx.reply('✅ You have subscribed to daily weather updates!');
      } else {
        ctx.reply('📢 You are already subscribed!');
      }
    });
  
    this.bot.command('unsubscribe', (ctx) => {
      const chatId = ctx.chat.id;
      let subscribers = this.getSubscribers();
  
      if (subscribers.includes(chatId)) {
        subscribers = subscribers.filter(id => id !== chatId);
        this.saveSubscribers(subscribers);
        ctx.reply('❌ You have unsubscribed from daily weather updates.');
      } else {
        ctx.reply('⚠️ You are not subscribed.');
      }
    });
  
    this.bot.hears(/.*/, async (ctx) => {
      const state = ctx.message.text;
      const weather = await this.getWeather(state);
      ctx.reply(weather);
    });

  
    await this.bot.launch();
    setInterval(async () => {
        await this.sendDailyUpdates();
      }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  }
  

  private async getWeather(state: string): Promise<string> {
    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const url = `${process.env.WEATHER_API_URL}?q=${state}&appid=${apiKey}&units=metric`;

      const response = await axios.get(url);
      const data = response.data;

      return `🌤 Weather in ${data.name}:
      - Temperature: ${data.main.temp}°C
      - Condition: ${data.weather[0].description}`;
    } catch (error) {
      return '⚠️ Could not fetch weather data. Please try again with a valid state name.';
    }
  }
  private subscribersFile = path.join(__dirname, '../../subscribers.json');

private getSubscribers(): number[] {
  if (!fs.existsSync(this.subscribersFile)) {
    return [];
  }
  const data = fs.readFileSync(this.subscribersFile, 'utf-8');
  return JSON.parse(data) as number[];
}

private saveSubscribers(subscribers: number[]) {
  fs.writeFileSync(this.subscribersFile, JSON.stringify(subscribers, null, 2));
}
private async sendDailyUpdates() {
    const subscribers = this.getSubscribers();
    if (subscribers.length === 0) return;
  
    const defaultState = process.env.DEFAULT_STATE || 'Lucknow';
    const weather = await this.getWeather(defaultState);
  
    for (const chatId of subscribers) {
      try {
        await this.bot.telegram.sendMessage(chatId, `🌅 Daily Weather Update for ${defaultState}:\n${weather}`);
      } catch (error) {
        console.error(`Failed to send message to ${chatId}`, error);
      }
    }
  }
  

}
