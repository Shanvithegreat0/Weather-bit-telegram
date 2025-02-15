import { Module } from '@nestjs/common';
import { WeatherBotService } from './weather-bot.service';

@Module({
  providers: [WeatherBotService],
  exports: [WeatherBotService], // ✅ Export the service so AdminModule can use it
})
export class WeatherBotModule {}
