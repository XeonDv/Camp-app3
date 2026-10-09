import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistrationDto } from './create-registration.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateRegistrationDto extends PartialType(CreateRegistrationDto) {}

export class UpdateStatusDto {
  @IsString()
  @IsEnum(['pending', 'approved', 'waitlist', 'cancelled'])
  status: string;
}

export class UpdatePaymentDto {
  @IsString()
  @IsEnum(['unpaid', 'partial', 'paid', 'refunded'])
  paymentStatus: string;

  @IsOptional()
  paymentAmount?: number;
}
