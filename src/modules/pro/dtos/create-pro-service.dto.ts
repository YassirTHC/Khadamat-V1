import { IsString, IsNumber, IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { PricingType } from '@prisma/client';

export class CreateProServiceDto {
  @IsString()
  categoryId: string;

  @IsString()
  cityId: string;

  @IsEnum(PricingType)
  pricingType: PricingType;

  @ValidateIf((o) => o.pricingType === PricingType.FIXED)
  @IsNumber()
  basePrice?: number;

  @IsString()
  description: string;
}
