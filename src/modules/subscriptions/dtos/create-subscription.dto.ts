import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  subscriptionPlanId: string;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean = true;
}
