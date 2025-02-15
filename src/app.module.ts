import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WeatherBotModule } from './weather-bot/weather-bot.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';


@Module({
  controllers: [AppController], 
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Serve frontend from 'public' folder
    }),
    WeatherBotModule,
    AdminModule,
  ],
})
export class AppModule {}
