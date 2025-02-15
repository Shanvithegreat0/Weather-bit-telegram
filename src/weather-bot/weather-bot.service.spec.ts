import { Test, TestingModule } from '@nestjs/testing';
import { WeatherBotService } from './weather-bot.service';

describe('WeatherBotService', () => {
  let service: WeatherBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherBotService],
    }).compile();

    service = module.get<WeatherBotService>(WeatherBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
