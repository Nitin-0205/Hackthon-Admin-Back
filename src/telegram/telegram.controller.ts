import { Controller, Param, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Telegram')
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  async getHello(): Promise<any> {
    return await  this.telegramService.sendProblem();
  }

  @Post('send')
  async sendMessage(): Promise<any> {
    return await this.telegramService.sendMessage('123', 'Hello');
  }
  @Post('sendProblem/:TeamId')
  async sendProblem(@Param("TeamId")TeamId:string): Promise<any> {
    return await this.telegramService.sendProblemStatement(TeamId);
  }


}
