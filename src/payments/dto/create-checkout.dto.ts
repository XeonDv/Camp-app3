import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCheckoutDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  registrationId: string;
}
