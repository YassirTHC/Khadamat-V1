import { Module } from '@nestjs/common';
import { CommunicationEventsController } from './communication-events.controller';
import { CommunicationEventsService } from './communication-events.service';

@Module({
  controllers: [CommunicationEventsController],
  providers: [CommunicationEventsService],
})
export class CommunicationEventsModule {}
