import { Controller, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Telegram')
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  async getHello(): Promise<any> {
    return  this.telegramService.sendMessage(33, "Hello World!");
  }
}
