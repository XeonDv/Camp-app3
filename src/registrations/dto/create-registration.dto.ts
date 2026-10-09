import { Type } from 'class-transformer';
import {
  ArrayUnique,
  Equals,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

/**
 * Formulario de registro 2027 (ver "YLCamp Formulario de Registro 2027.pdf").
 * Estos nombres y valores permitidos DEBEN coincidir con web/src/form/payload.ts
 * y web/src/types.ts. Cualquier campo que no esté aquí es rechazado por la API.
 */

export const GENDERS = ['Male', 'Female', 'Other'] as const;
export const ACCOMMODATION_TYPES = ['residence', 'homestay', 'day-camper'] as const;
export const PARENT_ACCOMMODATIONS = ['residence', 'homestay', 'none'] as const;
export const ACADEMIC_PROGRAMS = [
  'general-english',
  'leadership-entrepreneurship',
  'digital-media',
  'artificial-intelligence',
] as const;
export const AIRPORT_TRANSFERS = ['arrival', 'departure', 'both', 'none'] as const;
export const NIGHT_STAYS = [
  'students-residence',
  'students-homestay',
  'parents-residence',
  'parents-homestay',
] as const;
export const PLACEMENT_TESTS = ['take', 'skip'] as const;
export const CAMP_CENTRES = ['university-of-toronto'] as const;

const SHORT = 200;
const LONG = 2000;

export class CreateRegistrationDto {
  // ------------------------------------------------ 1. Estudiante
  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  studentGivenName: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  studentLastName: string;

  @IsIn(GENDERS as unknown as string[])
  studentGender: string;

  @IsDateString()
  studentDateOfBirth: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  studentNationality: string;

  @IsOptional() @IsString() @MaxLength(SHORT)
  studentMotherTongue?: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  studentPassportNumber: string;

  @IsString() @IsNotEmpty() @MaxLength(LONG)
  studentHomeAddress: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  studentCountry: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  studentCity: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  studentProvinceState: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  studentPostalCode: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  studentPhone: string;

  @IsOptional() @IsEmail() @MaxLength(SHORT)
  studentEmail?: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  emergencyContactName: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  emergencyContactPhone: string;

  @IsOptional() @IsEmail() @MaxLength(SHORT)
  emergencyContactEmail?: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  emergencyContactRelationship: string;

  @IsBoolean()
  currentlyInCanada: boolean;

  /** Solo es obligatoria si el estudiante ya está en Canadá. */
  @ValidateIf((o: CreateRegistrationDto) => o.currentlyInCanada === true)
  @IsString() @IsNotEmpty() @MaxLength(LONG)
  canadaAddress?: string;

  // ------------------------------------------------ 2. Agencia (opcional)
  @IsOptional() @IsString() @MaxLength(SHORT)
  agencyName?: string;

  @IsOptional() @IsString() @MaxLength(SHORT)
  agencyContactPerson?: string;

  @IsOptional() @IsEmail() @MaxLength(SHORT)
  agencyEmail?: string;

  // ------------------------------------------------ 3. Padres / tutores
  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  parentFullName: string;

  @IsOptional() @IsDateString()
  parentDateOfBirth?: string;

  @IsEmail() @MaxLength(SHORT)
  parentEmail: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  parentPhone: string;

  @IsOptional() @IsString() @MaxLength(SHORT)
  parent2FullName?: string;

  @IsOptional() @IsDateString()
  parent2DateOfBirth?: string;

  @IsOptional() @IsEmail() @MaxLength(SHORT)
  parent2Email?: string;

  @IsOptional() @IsString() @MaxLength(SHORT)
  parent2Phone?: string;

  // ------------------------------------------------ 4. Historial médico
  @IsOptional() @IsString() @MaxLength(LONG)
  allergies?: string;

  @IsOptional() @IsString() @MaxLength(LONG)
  medicalConditions?: string;

  @IsOptional() @IsString() @MaxLength(LONG)
  medications?: string;

  @IsOptional() @IsString() @MaxLength(LONG)
  specialDietary?: string;

  // ------------------------------------------------ 5. Centro, fechas, alojamiento
  @IsIn(CAMP_CENTRES as unknown as string[])
  campCentre: string;

  @Type(() => Number)
  @IsInt() @Min(1) @Max(4)
  durationWeeks: number;

  @IsDateString()
  preferredStartDate: string;

  @IsDateString()
  departureDate: string;

  @IsIn(ACCOMMODATION_TYPES as unknown as string[])
  accommodationType: string;

  @IsIn(PARENT_ACCOMMODATIONS as unknown as string[])
  parentAccommodation: string;

  // ------------------------------------------------ 6. Programa académico
  @IsIn(ACADEMIC_PROGRAMS as unknown as string[])
  academicProgram: string;

  // ------------------------------------------------ 7. Servicios opcionales
  @IsIn(AIRPORT_TRANSFERS as unknown as string[])
  airportTransfer: string;

  @IsBoolean()
  frenchCanadaTour: boolean;

  @IsBoolean()
  notarizedCustodyLetter: boolean;

  @IsBoolean()
  officialCertificate: boolean;

  @IsArray()
  @ArrayUnique()
  @IsIn(NIGHT_STAYS as unknown as string[], { each: true })
  additionalNightStays: string[];

  // ------------------------------------------------ 8. Prueba de nivel
  @IsIn(PLACEMENT_TESTS as unknown as string[])
  placementTest: string;

  // ------------------------------------------------ 9. Términos y firma
  @Equals(true, { message: 'termsAccepted must be true' })
  termsAccepted: boolean;

  @IsDateString()
  signatureDate: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  parentGuardianFullName: string;

  @IsString() @IsNotEmpty() @MaxLength(SHORT)
  parentSignature: string;
}
