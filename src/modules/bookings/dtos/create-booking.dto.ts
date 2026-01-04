import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { PricingType } from '@prisma/client';

export class CreateBookingDto {
  /**
   * Preferred: user id of the provider (role PRO)
   */
  @IsString()
  @IsOptional()
  proUserId?: string;

  /**
   * Legacy alias kept temporarily for compatibility.
   */
  @IsString()
  @IsOptional()
  proId?: string;

  @IsString()
  serviceCategoryId: string;

  @IsString()
  cityId: string;

  @IsDateString()
  @IsNotEmpty()
  timeSlot: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsEnum(PricingType)
  pricingType?: PricingType;
}
