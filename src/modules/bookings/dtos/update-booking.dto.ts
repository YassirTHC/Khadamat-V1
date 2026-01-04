import {
  IsOptional,
  IsIn,
  IsNumber,
  IsDateString,
} from 'class-validator';
import {
  BookingStatus,
  BOOKING_STATUS_VALUES,
} from '../enums/booking-status.enum';

export class UpdateBookingDto {
  @IsOptional()
  @IsIn(BOOKING_STATUS_VALUES)
  status?: BookingStatus;

  @IsOptional()
  @IsDateString()
  timeSlot?: string;

  @IsOptional()
  @IsNumber()
  finalPrice?: number;

  @IsOptional()
  @IsIn(['pending', 'paid', 'refunded'])
  paymentStatus?: string;
}
