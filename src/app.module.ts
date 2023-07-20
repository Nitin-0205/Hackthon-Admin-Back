import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParticipantModule } from './participant/participant.module';
import { EventsModule } from './events/events.module';
import { ProblemStatementModule } from './problem-statement/problem-statement.module';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),ParticipantModule, EventsModule, ProblemStatementModule, TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
