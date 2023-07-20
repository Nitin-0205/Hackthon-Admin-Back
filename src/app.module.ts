import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParticipantModule } from './participant/participant.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [ParticipantModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
