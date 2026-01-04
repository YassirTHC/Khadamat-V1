import { IsOptional, IsBoolean, IsString, IsNumber, IsEnum, ValidateIf } from 'class-validator';
import { PricingType } from '@prisma/client';

export class UpdateProServiceDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  cityId?: string;

  @IsOptional()
  @IsEnum(PricingType)
  pricingType?: PricingType;

  @ValidateIf((o) => !o.pricingType || o.pricingType === PricingType.FIXED)
  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
