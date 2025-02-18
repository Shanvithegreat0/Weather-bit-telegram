import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { FirebaseService } from '../services/firebase.service'; // Ensure this path is correct
import { User } from '../types'; // Import User type from types.ts

dotenv.config();

@Injectable()

export class WeatherBotService implements OnModuleInit {
  public bot: Telegraf;

  constructor(private readonly firebaseService: FirebaseService) {
    this.bot = new Telegraf(process.env.BOT_TOKEN || '');
  }

  async onModuleInit() {
    this.bot.start((ctx) => {
      const chatId = ctx.chat.id;
      const username =
        'username' in ctx.chat && ctx.chat.username
          ? ctx.chat.username
          : 'first_name' in ctx.chat && ctx.chat.first_name
          ? ctx.chat.first_name
          : `User_${chatId}`;
      this.addUser(chatId, username);

      ctx.reply('Welcome! Send me a state name to get the weather forecast.');
    });

    this.bot.command('subscribe', (ctx) => {
      const chatId = ctx.chat.id;
      this.subscribeUser(chatId);
      ctx.reply('✅ You have subscribed to daily weather updates!');
    });

    this.bot.command('unsubscribe', (ctx) => {
      const chatId = ctx.chat.id;
      this.unsubscribeUser(chatId);
      ctx.reply('❌ You have unsubscribed from daily weather updates.');
    });

    this.bot.hears(/.*/, async (ctx) => {
      const state = ctx.message.text;
      const weather = await this.getWeather(state);
      ctx.reply(weather);
    });

    await this.bot.launch();

    setInterval(async () => {
      await this.sendDailyUpdates();
    }, 24 * 60 * 60 * 1000); // 24 hours
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

  private async addUser(userId: number, username: string) {
    const user: User = {
      id: userId,
      name: username,
      isSubscribed: false,
    };
    await this.firebaseService.saveUser(userId.toString(), username, false); // Using userId as string for Firebase
  }

  private async subscribeUser(userId: number) {
    const user = await this.firebaseService.getUser(userId.toString()); // Firebase returns a User object
    if (user) {
      await this.firebaseService.updateSubscription(userId.toString(), true);
    }
  }

  private async unsubscribeUser(userId: number) {
    const user = await this.firebaseService.getUser(userId.toString()); // Firebase returns a User object
    if (user) {
      await this.firebaseService.updateSubscription(userId.toString(), false);
    }
  }

  private async sendDailyUpdates() {
    const users = await this.firebaseService.getAllUsers(); // Get users from Firebase
    const subscribers = Object.values(users).filter((user) => user.isSubscribed); // Filter out subscribed users

    if (subscribers.length === 0) return;

    const defaultState = process.env.DEFAULT_STATE || 'Lucknow';
    const weather = await this.getWeather(defaultState);

    for (const user of subscribers) {
      try {
        await this.bot.telegram.sendMessage(
          user.id,
          `🌅 Daily Weather Update for ${defaultState}:\n${weather}`
        );
      } catch (error) {
        console.error(`Failed to send message to ${user.id}`, error);
      }
    }
  }
}
