import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
// export class TelegramService{

//   constructor(private readonly configService: ConfigService) {}
  
  
//   private readonly baseUrl = `${process.env.TELEGRAM_BASE_URL}`;
//   private readonly token = "6358226590:AAE394MjEtH0NIAtFGTC9ZUZdU7Jrjgm0TE";

//   async sendMessage(chatId: string, text: string): Promise<any> {
//     const url = `${this.baseUrl}${this.token}/sendMessage`;

//     const data = {
//       chat_id: chatId,
//       text,
//     };


//     try {
//       const response = await axios.post(url, data);
//       return response.data;
//     } catch (error) {
//       throw new Error('Failed to send message to Telegram.');
//     }
//   }
// }
export class TelegramService {
  private readonly baseUrl = `https://api.telegram.org/bot6358226590:AAE394MjEtH0NIAtFGTC9ZUZdU7Jrjgm0TE`;

  async sendMessage(chatId: number, text: string): Promise<void> {
    const url = `${this.baseUrl}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  }
}
