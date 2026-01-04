import { CommunicationChannel } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateCommunicationEventDto {
  @IsEnum(CommunicationChannel)
  channel: CommunicationChannel;

  @IsString()
  proId: string;

  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
