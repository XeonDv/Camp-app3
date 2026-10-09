import {
  IsString,
  IsDateString,
  IsInt,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CampDateRangeDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class CreateCampDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CampDateRangeDto)
  dates: CampDateRangeDto[];

  @IsInt()
  @Min(1)
  capacity: number;

  @IsInt()
  @Min(0)
  ageRangeMin: number;

  @IsInt()
  @Min(0)
  ageRangeMax: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsEnum(['open', 'full', 'closed'])
  status?: string;
}
