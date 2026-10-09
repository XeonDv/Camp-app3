import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { QueryRegistrationsDto } from './dto/query-registrations.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RegistrationsService {
  private readonly logger = new Logger(RegistrationsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createRegistrationDto: CreateRegistrationDto) {
    const registrationId = `YLC-${new Date().getFullYear()}-${Date.now()}`;

    this.logger.log(`📝 Creating new registration: ${registrationId}`);
    this.logger.debug(`Student: ${createRegistrationDto.studentGivenName} ${createRegistrationDto.studentLastName}`);
    this.logger.debug(`Program: ${createRegistrationDto.programSelection}`);

    const data: Prisma.CampRegistrationCreateInput = {
      id: registrationId,
      ...this.mapDtoToPrismaData(createRegistrationDto),
    };

    try {
      const registration = await this.prisma.campRegistration.create({
        data,
      });
      this.logger.log(`✅ Registration created successfully: ${registrationId}`);
      return registration;
    } catch (error) {
      this.logger.error(`❌ Failed to create registration: ${registrationId}`, error);
      throw error;
    }
  }

  async findAll(query: QueryRegistrationsDto) {
    const { page = 1, limit = 10, search, status, paymentStatus } = query;
    const skip = (page - 1) * limit;

    this.logger.log(`🔍 Fetching registrations - Page: ${page}, Limit: ${limit}`);
    if (search) this.logger.debug(`Search query: ${search}`);
    if (status) this.logger.debug(`Status filter: ${status}`);
    if (paymentStatus) this.logger.debug(`Payment status filter: ${paymentStatus}`);

    const where: Prisma.CampRegistrationWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (search) {
      where.OR = [
        { studentLastName: { contains: search } },
        { studentGivenName: { contains: search } },
        { studentEmail: { contains: search } },
        { id: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.campRegistration.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.campRegistration.count({ where }),
    ]);

    this.logger.log(`✅ Found ${total} registration(s), returning ${data.length} for page ${page}`);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    this.logger.debug(`🔍 Fetching registration: ${id}`);
    
    const registration = await this.prisma.campRegistration.findUnique({
      where: { id },
    });

    if (!registration) {
      this.logger.warn(`⚠️ Registration not found: ${id}`);
      throw new NotFoundException(`Registration with ID ${id} not found`);
    }

    this.logger.debug(`✅ Registration found: ${id}`);
    return registration;
  }

  async updateStatus(id: string, status: string) {
    this.logger.log(`🔄 Updating registration status: ${id} -> ${status}`);
    
    const registration = await this.findOne(id);

    const updated = await this.prisma.campRegistration.update({
      where: { id },
      data: { status },
    });

    this.logger.log(`✅ Registration status updated: ${id} -> ${status}`);
    return updated;
  }

  async updatePayment(id: string, paymentStatus: string, paymentAmount?: number) {
    this.logger.log(`💳 Updating payment: ${id} -> ${paymentStatus}${paymentAmount ? ` ($${paymentAmount})` : ''}`);
    
    const registration = await this.findOne(id);

    const updateData: Prisma.CampRegistrationUpdateInput = {
      paymentStatus,
    };

    if (paymentAmount !== undefined) {
      updateData.paymentAmount = paymentAmount;
    }

    const updated = await this.prisma.campRegistration.update({
      where: { id },
      data: updateData,
    });

    this.logger.log(`✅ Payment updated: ${id} -> ${paymentStatus}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.warn(`🗑️ Deleting registration: ${id}`);
    
    await this.findOne(id);

    const deleted = await this.prisma.campRegistration.delete({
      where: { id },
    });

    this.logger.log(`✅ Registration deleted: ${id}`);
    return deleted;
  }

  private mapDtoToPrismaData(dto: CreateRegistrationDto): Prisma.CampRegistrationCreateInput {
    return {
      campId: dto.campId,
      programSelection: dto.programSelection,
      preferredStartDate: new Date(dto.preferredStartDate),
      agencyName: dto.agencyName,
      agencyEmail: dto.agencyEmail,
      agencyPhone: dto.agencyPhone,
      studentLastName: dto.studentLastName,
      studentGivenName: dto.studentGivenName,
      studentNickName: dto.studentNickName,
      studentGender: dto.studentGender,
      studentDateOfBirth: new Date(dto.studentDateOfBirth),
      studentAge: dto.studentAge,
      studentNationality: dto.studentNationality,
      studentPassportNumber: dto.studentPassportNumber,
      studentPassportIssueDate: dto.studentPassportIssueDate
        ? new Date(dto.studentPassportIssueDate)
        : null,
      studentPassportExpiryDate: new Date(dto.studentPassportExpiryDate),
      studentCurrentSchool: dto.studentCurrentSchool,
      studentGrade: dto.studentGrade,
      studentEmail: dto.studentEmail,
      studentPhone: dto.studentPhone,
      studentHomeAddress: dto.studentHomeAddress,
      studentCity: dto.studentCity,
      studentProvinceState: dto.studentProvinceState,
      studentCountry: dto.studentCountry,
      studentPostalCode: dto.studentPostalCode,
      parentFullName: dto.parentFullName,
      parentRelationship: dto.parentRelationship,
      parentPhone: dto.parentPhone,
      parentEmail: dto.parentEmail,
      parentOccupation: dto.parentOccupation,
      emergencyContactLastName: dto.emergencyContactLastName,
      emergencyContactGivenName: dto.emergencyContactGivenName,
      emergencyContactPhone: dto.emergencyContactPhone,
      emergencyContactEmail: dto.emergencyContactEmail,
      accompanyingParent1LastName: dto.accompanyingParent1LastName,
      accompanyingParent1GivenName: dto.accompanyingParent1GivenName,
      accompanyingParent1Relation: dto.accompanyingParent1Relation,
      accompanyingParent1DateOfBirth: dto.accompanyingParent1DateOfBirth
        ? new Date(dto.accompanyingParent1DateOfBirth)
        : null,
      accompanyingParent1Age: dto.accompanyingParent1Age,
      accompanyingParent1Gender: dto.accompanyingParent1Gender,
      accompanyingParent1Nationality: dto.accompanyingParent1Nationality,
      accompanyingParent1PassportNumber: dto.accompanyingParent1PassportNumber,
      accompanyingParent1PassportExpiry: dto.accompanyingParent1PassportExpiry
        ? new Date(dto.accompanyingParent1PassportExpiry)
        : null,
      accompanyingParent1Phone: dto.accompanyingParent1Phone,
      accompanyingParent1Email: dto.accompanyingParent1Email,
      accompanyingParent2LastName: dto.accompanyingParent2LastName,
      accompanyingParent2GivenName: dto.accompanyingParent2GivenName,
      accompanyingParent2Relation: dto.accompanyingParent2Relation,
      accompanyingParent2DateOfBirth: dto.accompanyingParent2DateOfBirth
        ? new Date(dto.accompanyingParent2DateOfBirth)
        : null,
      accompanyingParent2Age: dto.accompanyingParent2Age,
      accompanyingParent2Gender: dto.accompanyingParent2Gender,
      accompanyingParent2Nationality: dto.accompanyingParent2Nationality,
      accompanyingParent2PassportNumber: dto.accompanyingParent2PassportNumber,
      accompanyingParent2PassportExpiry: dto.accompanyingParent2PassportExpiry
        ? new Date(dto.accompanyingParent2PassportExpiry)
        : null,
      accompanyingParent2Phone: dto.accompanyingParent2Phone,
      accompanyingParent2Email: dto.accompanyingParent2Email,
      englishLevel: dto.englishLevel,
      ieltsOverall: dto.ieltsOverall,
      ieltsDate: dto.ieltsDate ? new Date(dto.ieltsDate) : null,
      toeflScore: dto.toeflScore,
      toeflDate: dto.toeflDate ? new Date(dto.toeflDate) : null,
      otherCertificate: dto.otherCertificate,
      studentStrengths: dto.studentStrengths,
      studentInterests: dto.studentInterests,
      previousInternationalExperience: dto.previousInternationalExperience,
      previousExperienceDetails: dto.previousExperienceDetails,
      generalHealthCondition: dto.generalHealthCondition,
      allergies: dto.allergies,
      medicalConditions: dto.medicalConditions,
      medications: dto.medications,
      specialDietary: dto.specialDietary,
      hasAllergies: dto.hasAllergies,
      allergiesDetails: dto.allergiesDetails,
      hasChronicIllness: dto.hasChronicIllness,
      chronicIllnessDetails: dto.chronicIllnessDetails,
      regularMedication: dto.regularMedication,
      specialDiet: dto.specialDiet,
      specialDietDetails: dto.specialDietDetails,
      specialNeeds: dto.specialNeeds,
      travelArrangement: dto.travelArrangement,
      accommodationType: dto.accommodationType,
      accommodationOther: dto.accommodationOther,
      arrivalAirline: dto.arrivalAirline,
      arrivalFlightNumber: dto.arrivalFlightNumber,
      arrivalDepartureAirport: dto.arrivalDepartureAirport,
      arrivalAirportToronto: dto.arrivalAirportToronto,
      arrivalDateTime: dto.arrivalDateTime ? new Date(dto.arrivalDateTime) : null,
      departureAirline: dto.departureAirline,
      departureFlightNumber: dto.departureFlightNumber,
      departureDateTime: dto.departureDateTime
        ? new Date(dto.departureDateTime)
        : null,
      flightSpecialRequests: dto.flightSpecialRequests,
      activityParticipationConsent: dto.activityParticipationConsent,
      activityRiskAcceptance: dto.activityRiskAcceptance,
      activityLiabilityRelease: dto.activityLiabilityRelease,
      propertyRespectAgreement: dto.propertyRespectAgreement,
      propertyDamageResponsibility: dto.propertyDamageResponsibility,
      medicalInfoAccuracy: dto.medicalInfoAccuracy,
      allergyEnvironmentUnderstanding: dto.allergyEnvironmentUnderstanding,
      emergencyInsuranceUnderstanding: dto.emergencyInsuranceUnderstanding,
      emergencyTreatmentAuthorization: dto.emergencyTreatmentAuthorization,
      medicalCostResponsibility: dto.medicalCostResponsibility,
      privacyPolicyUnderstanding: dto.privacyPolicyUnderstanding,
      mediaConsent: dto.mediaConsent,
      informationTruthConfirmation: dto.informationTruthConfirmation,
      applicationFormUnderstanding: dto.applicationFormUnderstanding,
      campRulesAgreement: dto.campRulesAgreement,
      consentWaiverSignAgreement: dto.consentWaiverSignAgreement,
      parentGuardianFullName: dto.parentGuardianFullName,
      parentGuardianRelation: dto.parentGuardianRelation,
      parentSignature: dto.parentSignature,
      signatureDate: dto.signatureDate ? new Date(dto.signatureDate) : null,
    };
  }
}
