import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsPhoneNumber,
} from 'class-validator';

export class CreateRegistrationDto {
  @IsOptional()
  @IsString()
  campId?: string;

  @IsString()
  @IsEnum(['2weeks', '3weeks'])
  programSelection: string;

  @IsDateString()
  preferredStartDate: string;

  @IsOptional()
  @IsString()
  agencyName?: string;

  @IsOptional()
  @IsEmail()
  agencyEmail?: string;

  @IsOptional()
  @IsString()
  agencyPhone?: string;

  @IsString()
  studentLastName: string;

  @IsString()
  studentGivenName: string;

  @IsOptional()
  @IsString()
  studentNickName?: string;

  @IsString()
  @IsEnum(['Male', 'Female'])
  studentGender: string;

  @IsDateString()
  studentDateOfBirth: string;

  @IsOptional()
  @IsNumber()
  studentAge?: number;

  @IsString()
  studentNationality: string;

  @IsString()
  studentPassportNumber: string;

  @IsOptional()
  @IsDateString()
  studentPassportIssueDate?: string;

  @IsDateString()
  studentPassportExpiryDate: string;

  @IsOptional()
  @IsString()
  studentCurrentSchool?: string;

  @IsOptional()
  @IsString()
  studentGrade?: string;

  @IsOptional()
  @IsEmail()
  studentEmail?: string;

  @IsOptional()
  @IsString()
  studentPhone?: string;

  @IsOptional()
  @IsString()
  studentHomeAddress?: string;

  @IsOptional()
  @IsString()
  studentCity?: string;

  @IsOptional()
  @IsString()
  studentProvinceState?: string;

  @IsOptional()
  @IsString()
  studentCountry?: string;

  @IsOptional()
  @IsString()
  studentPostalCode?: string;

  @IsString()
  parentFullName: string;

  @IsString()
  @IsEnum(['Father', 'Mother', 'Guardian'])
  parentRelationship: string;

  @IsString()
  parentPhone: string;

  @IsEmail()
  parentEmail: string;

  @IsOptional()
  @IsString()
  parentOccupation?: string;

  @IsOptional()
  @IsString()
  emergencyContactLastName?: string;

  @IsOptional()
  @IsString()
  emergencyContactGivenName?: string;

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @IsOptional()
  @IsEmail()
  emergencyContactEmail?: string;

  @IsOptional()
  @IsString()
  accompanyingParent1LastName?: string;

  @IsOptional()
  @IsString()
  accompanyingParent1GivenName?: string;

  @IsOptional()
  @IsString()
  accompanyingParent1Relation?: string;

  @IsOptional()
  @IsDateString()
  accompanyingParent1DateOfBirth?: string;

  @IsOptional()
  @IsNumber()
  accompanyingParent1Age?: number;

  @IsOptional()
  @IsString()
  @IsEnum(['Male', 'Female'])
  accompanyingParent1Gender?: string;

  @IsOptional()
  @IsString()
  accompanyingParent1Nationality?: string;

  @IsOptional()
  @IsString()
  accompanyingParent1PassportNumber?: string;

  @IsOptional()
  @IsDateString()
  accompanyingParent1PassportExpiry?: string;

  @IsOptional()
  @IsString()
  accompanyingParent1Phone?: string;

  @IsOptional()
  @IsEmail()
  accompanyingParent1Email?: string;

  @IsOptional()
  @IsString()
  accompanyingParent2LastName?: string;

  @IsOptional()
  @IsString()
  accompanyingParent2GivenName?: string;

  @IsOptional()
  @IsString()
  accompanyingParent2Relation?: string;

  @IsOptional()
  @IsDateString()
  accompanyingParent2DateOfBirth?: string;

  @IsOptional()
  @IsNumber()
  accompanyingParent2Age?: number;

  @IsOptional()
  @IsString()
  @IsEnum(['Male', 'Female'])
  accompanyingParent2Gender?: string;

  @IsOptional()
  @IsString()
  accompanyingParent2Nationality?: string;

  @IsOptional()
  @IsString()
  accompanyingParent2PassportNumber?: string;

  @IsOptional()
  @IsDateString()
  accompanyingParent2PassportExpiry?: string;

  @IsOptional()
  @IsString()
  accompanyingParent2Phone?: string;

  @IsOptional()
  @IsEmail()
  accompanyingParent2Email?: string;

  @IsString()
  @IsEnum([
    'Beginner',
    'Elementary',
    'Pre-Intermediate',
    'Intermediate',
    'Upper-Intermediate',
    'Advanced',
  ])
  englishLevel: string;

  @IsOptional()
  @IsString()
  ieltsOverall?: string;

  @IsOptional()
  @IsDateString()
  ieltsDate?: string;

  @IsOptional()
  @IsString()
  toeflScore?: string;

  @IsOptional()
  @IsDateString()
  toeflDate?: string;

  @IsOptional()
  @IsString()
  otherCertificate?: string;

  @IsOptional()
  @IsString()
  studentStrengths?: string;

  @IsOptional()
  @IsString()
  studentInterests?: string;

  @IsString()
  @IsEnum(['Never', 'Yes'])
  previousInternationalExperience: string;

  @IsOptional()
  @IsString()
  previousExperienceDetails?: string;

  @IsString()
  @IsEnum(['Good', 'Average', 'Other'])
  generalHealthCondition: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  medicalConditions?: string;

  @IsOptional()
  @IsString()
  medications?: string;

  @IsOptional()
  @IsString()
  specialDietary?: string;

  @IsOptional()
  @IsBoolean()
  hasAllergies?: boolean;

  @IsOptional()
  @IsString()
  allergiesDetails?: string;

  @IsOptional()
  @IsBoolean()
  hasChronicIllness?: boolean;

  @IsOptional()
  @IsString()
  chronicIllnessDetails?: string;

  @IsOptional()
  @IsString()
  regularMedication?: string;

  @IsOptional()
  @IsString()
  @IsEnum(['Vegetarian', 'No pork', 'Other', 'None'])
  specialDiet?: string;

  @IsOptional()
  @IsString()
  specialDietDetails?: string;

  @IsOptional()
  @IsString()
  specialNeeds?: string;

  @IsString()
  @IsEnum(['group', 'individual', 'parents-accompany'])
  travelArrangement: string;

  @IsString()
  @IsEnum(['dormitory', 'homestay', 'other'])
  accommodationType: string;

  @IsOptional()
  @IsString()
  accommodationOther?: string;

  @IsOptional()
  @IsString()
  arrivalAirline?: string;

  @IsOptional()
  @IsString()
  arrivalFlightNumber?: string;

  @IsOptional()
  @IsString()
  arrivalDepartureAirport?: string;

  @IsOptional()
  @IsString()
  arrivalAirportToronto?: string;

  @IsOptional()
  @IsDateString()
  arrivalDateTime?: string;

  @IsOptional()
  @IsString()
  departureAirline?: string;

  @IsOptional()
  @IsString()
  departureFlightNumber?: string;

  @IsOptional()
  @IsDateString()
  departureDateTime?: string;

  @IsOptional()
  @IsString()
  flightSpecialRequests?: string;

  @IsBoolean()
  activityParticipationConsent: boolean;

  @IsBoolean()
  activityRiskAcceptance: boolean;

  @IsBoolean()
  activityLiabilityRelease: boolean;

  @IsBoolean()
  propertyRespectAgreement: boolean;

  @IsBoolean()
  propertyDamageResponsibility: boolean;

  @IsBoolean()
  medicalInfoAccuracy: boolean;

  @IsBoolean()
  allergyEnvironmentUnderstanding: boolean;

  @IsBoolean()
  emergencyInsuranceUnderstanding: boolean;

  @IsBoolean()
  emergencyTreatmentAuthorization: boolean;

  @IsBoolean()
  medicalCostResponsibility: boolean;

  @IsBoolean()
  privacyPolicyUnderstanding: boolean;

  @IsString()
  @IsEnum(['yes', 'no'])
  mediaConsent: string;

  @IsBoolean()
  informationTruthConfirmation: boolean;

  @IsBoolean()
  applicationFormUnderstanding: boolean;

  @IsBoolean()
  campRulesAgreement: boolean;

  @IsBoolean()
  consentWaiverSignAgreement: boolean;

  @IsOptional()
  @IsString()
  parentGuardianFullName?: string;

  @IsOptional()
  @IsString()
  parentGuardianRelation?: string;

  @IsOptional()
  @IsString()
  parentSignature?: string;

  @IsOptional()
  @IsDateString()
  signatureDate?: string;
}
