import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WeatherBotModule } from './weather-bot/weather-bot.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { FirebaseService } from './services/firebase.service'; // ✅ Import Firebase Service

@Module({
  controllers: [AppController], 
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), 
    }),
    WeatherBotModule,
    AdminModule,
  ],
  providers: [FirebaseService], // ✅ Register Firebase Service
})
export class AppModule {}
