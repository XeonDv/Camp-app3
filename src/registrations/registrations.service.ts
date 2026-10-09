import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { QueryRegistrationsDto } from './dto/query-registrations.dto';
import { Prisma } from '@prisma/client';

/** Marca los registros creados con el formulario 2027 (los anteriores quedan como "2026"). */
export const FORM_VERSION = '2027';

@Injectable()
export class RegistrationsService {
  private readonly logger = new Logger(RegistrationsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Guarda una inscripción nueva. Solo devuelve lo que el formulario público
   * necesita (id y estados): nunca se devuelven datos personales a quien envía.
   */
  async create(dto: CreateRegistrationDto) {
    this.assertBusinessRules(dto);

    // Id difícil de adivinar: la página de "pago recibido" consulta por este número.
    const id = `YLC-${FORM_VERSION}-${randomBytes(6).toString('hex').toUpperCase()}`;
    this.logger.log(`📝 Creating registration ${id}`);

    try {
      const registration = await this.prisma.campRegistration.create({
        data: { id, ...this.mapDtoToPrismaData(dto) },
        select: { id: true, status: true, paymentStatus: true },
      });
      this.logger.log(`✅ Registration created: ${id}`);
      return registration;
    } catch (error) {
      this.logger.error(`❌ Failed to create registration ${id}`, error);
      throw error;
    }
  }

  /** Reglas que dependen de varios campos a la vez. */
  private assertBusinessRules(dto: CreateRegistrationDto) {
    const problems: string[] = [];
    const today = new Date().toISOString().slice(0, 10);

    if (dto.studentDateOfBirth.slice(0, 10) >= today) {
      problems.push('studentDateOfBirth must be in the past');
    }
    if (dto.departureDate.slice(0, 10) <= dto.preferredStartDate.slice(0, 10)) {
      problems.push('departureDate must be after preferredStartDate');
    }
    if (dto.frenchCanadaTour && dto.durationWeeks < 3) {
      problems.push('frenchCanadaTour is only available for programs of 3 or 4 weeks');
    }

    if (problems.length > 0) throw new BadRequestException(problems);
  }

  async findAll(query: QueryRegistrationsDto) {
    const { page = 1, limit = 10, search, status, paymentStatus } = query;
    const skip = (page - 1) * limit;

    this.logger.log(`🔍 Fetching registrations - Page: ${page}, Limit: ${limit}`);

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
        { parentEmail: { contains: search } },
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

    return registration;
  }

  async updateStatus(id: string, status: string) {
    this.logger.log(`🔄 Updating registration status: ${id} -> ${status}`);

    await this.findOne(id);

    const updated = await this.prisma.campRegistration.update({
      where: { id },
      data: { status },
    });

    this.logger.log(`✅ Registration status updated: ${id} -> ${status}`);
    return updated;
  }

  async updatePayment(id: string, paymentStatus: string, paymentAmount?: number) {
    this.logger.log(`💳 Updating payment: ${id} -> ${paymentStatus}${paymentAmount ? ` ($${paymentAmount})` : ''}`);

    await this.findOne(id);

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

  private mapDtoToPrismaData(dto: CreateRegistrationDto): Omit<Prisma.CampRegistrationCreateInput, 'id'> {
    const date = (value?: string) => (value ? new Date(value) : null);

    return {
      formVersion: FORM_VERSION,

      // 1. Estudiante
      studentGivenName: dto.studentGivenName,
      studentLastName: dto.studentLastName,
      studentGender: dto.studentGender,
      studentDateOfBirth: new Date(dto.studentDateOfBirth),
      studentNationality: dto.studentNationality,
      studentMotherTongue: dto.studentMotherTongue,
      studentPassportNumber: dto.studentPassportNumber,
      studentHomeAddress: dto.studentHomeAddress,
      studentCountry: dto.studentCountry,
      studentCity: dto.studentCity,
      studentProvinceState: dto.studentProvinceState,
      studentPostalCode: dto.studentPostalCode,
      studentPhone: dto.studentPhone,
      studentEmail: dto.studentEmail,
      emergencyContactName: dto.emergencyContactName,
      emergencyContactPhone: dto.emergencyContactPhone,
      emergencyContactEmail: dto.emergencyContactEmail,
      emergencyContactRelationship: dto.emergencyContactRelationship,
      currentlyInCanada: dto.currentlyInCanada,
      canadaAddress: dto.currentlyInCanada ? dto.canadaAddress : null,

      // 2. Agencia
      agencyName: dto.agencyName,
      agencyContactPerson: dto.agencyContactPerson,
      agencyEmail: dto.agencyEmail,

      // 3. Padres / tutores
      parentFullName: dto.parentFullName,
      parentDateOfBirth: date(dto.parentDateOfBirth),
      parentEmail: dto.parentEmail,
      parentPhone: dto.parentPhone,
      parent2FullName: dto.parent2FullName,
      parent2DateOfBirth: date(dto.parent2DateOfBirth),
      parent2Email: dto.parent2Email,
      parent2Phone: dto.parent2Phone,

      // 4. Historial médico
      allergies: dto.allergies,
      medicalConditions: dto.medicalConditions,
      medications: dto.medications,
      specialDietary: dto.specialDietary,

      // 5. Centro, fechas y alojamiento
      campCentre: dto.campCentre,
      durationWeeks: dto.durationWeeks,
      preferredStartDate: new Date(dto.preferredStartDate),
      departureDate: new Date(dto.departureDate),
      accommodationType: dto.accommodationType,
      parentAccommodation: dto.parentAccommodation,

      // 6. Programa académico
      academicProgram: dto.academicProgram,

      // 7. Servicios opcionales
      airportTransfer: dto.airportTransfer,
      frenchCanadaTour: dto.frenchCanadaTour,
      notarizedCustodyLetter: dto.notarizedCustodyLetter,
      officialCertificate: dto.officialCertificate,
      additionalNightStays: dto.additionalNightStays,

      // 8. Prueba de nivel
      placementTest: dto.placementTest,

      // 9. Términos y firma
      termsAccepted: dto.termsAccepted,
      signatureDate: new Date(dto.signatureDate),
      parentGuardianFullName: dto.parentGuardianFullName,
      parentSignature: dto.parentSignature,
    };
  }
}
