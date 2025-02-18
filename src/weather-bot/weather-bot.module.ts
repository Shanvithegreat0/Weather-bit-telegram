import { Module } from '@nestjs/common';
import { WeatherBotService } from './weather-bot.service';
import { FirebaseModule } from '../services/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [WeatherBotService],
  exports: [WeatherBotService], // Export WeatherBotService so it can be used in AdminModule
})
export class WeatherBotModule {}
