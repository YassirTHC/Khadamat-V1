import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommunicationEventsService } from './communication-events.service';
import { CreateCommunicationEventDto } from './dtos/create-communication-event.dto';
import { Request } from 'express';
import { User } from '@prisma/client';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('communication-events')
@UseGuards(JwtAuthGuard)
export class CommunicationEventsController {
  constructor(private readonly communicationEventsService: CommunicationEventsService) {}

  @Post()
  async create(@Req() req: RequestWithUser, @Body() dto: CreateCommunicationEventDto) {
    return this.communicationEventsService.create(req.user.id, dto);
  }
}
