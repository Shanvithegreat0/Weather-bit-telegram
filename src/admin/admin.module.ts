import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { WeatherBotModule } from '../weather-bot/weather-bot.module'; // ✅ Import the module

@Module({
  imports: [WeatherBotModule], // ✅ Import WeatherBotModule (not just WeatherBotService)
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
