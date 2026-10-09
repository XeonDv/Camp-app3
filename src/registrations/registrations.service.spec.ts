import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { RegistrationsService } from './registrations.service';

/** Cuerpo completo y válido, igual al que arma web/src/form/payload.ts. */
function validBody(overrides: Record<string, unknown> = {}) {
  return {
    studentGivenName: 'Ana',
    studentLastName: 'Pérez',
    studentGender: 'Female',
    studentDateOfBirth: '2012-05-01',
    studentNationality: 'Mexicana',
    studentPassportNumber: 'G12345678',
    studentHomeAddress: 'Calle 1 #2',
    studentCountry: 'México',
    studentCity: 'CDMX',
    studentProvinceState: 'CDMX',
    studentPostalCode: '01000',
    studentPhone: '+52 55 0000 0000',
    emergencyContactName: 'Luis Pérez',
    emergencyContactPhone: '+52 55 1111 1111',
    emergencyContactRelationship: 'Tío',
    currentlyInCanada: false,
    parentFullName: 'María López',
    parentEmail: 'maria@example.com',
    parentPhone: '+52 55 2222 2222',
    campCentre: 'university-of-toronto',
    durationWeeks: 3,
    preferredStartDate: '2027-06-19',
    departureDate: '2027-07-10',
    accommodationType: 'residence',
    parentAccommodation: 'none',
    academicProgram: 'general-english',
    airportTransfer: 'both',
    frenchCanadaTour: false,
    notarizedCustodyLetter: false,
    officialCertificate: false,
    additionalNightStays: [],
    placementTest: 'take',
    termsAccepted: true,
    signatureDate: '2026-10-09',
    parentGuardianFullName: 'María López',
    parentSignature: 'María López',
    ...overrides,
  };
}

const check = (body: object) =>
  validate(plainToInstance(CreateRegistrationDto, body), { whitelist: true, forbidNonWhitelisted: true });

describe('CreateRegistrationDto (validación)', () => {
  it('acepta un registro completo y válido', async () => {
    expect(await check(validBody())).toHaveLength(0);
  });

  it('exige aceptar los términos', async () => {
    const errors = await check(validBody({ termsAccepted: false }));
    expect(errors.map((e) => e.property)).toContain('termsAccepted');
  });

  it('rechaza campos desconocidos', async () => {
    const errors = await check(validBody({ campoInventado: 'x' }));
    expect(errors.map((e) => e.property)).toContain('campoInventado');
  });

  it('exige la dirección en Canadá solo si el estudiante ya está en Canadá', async () => {
    expect(await check(validBody({ currentlyInCanada: true }))).not.toHaveLength(0);
    expect(await check(validBody({ currentlyInCanada: true, canadaAddress: '1 Main St, Toronto' }))).toHaveLength(0);
  });

  it('rechaza valores fuera de las listas permitidas', async () => {
    const errors = await check(validBody({ academicProgram: 'cocina', durationWeeks: 9 }));
    const props = errors.map((e) => e.property);
    expect(props).toContain('academicProgram');
    expect(props).toContain('durationWeeks');
  });
});

describe('RegistrationsService.create', () => {
  const build = () => {
    const prisma = {
      campRegistration: {
        create: jest.fn().mockResolvedValue({ id: 'x', status: 'pending', paymentStatus: 'unpaid' }),
      },
    };
    return { service: new RegistrationsService(prisma as any), prisma };
  };
  const dto = (overrides: Record<string, unknown> = {}) =>
    plainToInstance(CreateRegistrationDto, validBody(overrides));

  it('guarda con id aleatorio, marca 2027 y devuelve solo id y estados', async () => {
    const { service, prisma } = build();

    const result = await service.create(dto());

    const args = prisma.campRegistration.create.mock.calls[0][0];
    expect(args.data.id).toMatch(/^YLC-2027-[0-9A-F]{12}$/);
    expect(args.data.formVersion).toBe('2027');
    expect(args.select).toEqual({ id: true, status: true, paymentStatus: true });
    expect(Object.keys(result).sort()).toEqual(['id', 'paymentStatus', 'status']);
  });

  it('rechaza una salida anterior o igual a la fecha de inicio', async () => {
    const { service, prisma } = build();
    await expect(service.create(dto({ departureDate: '2027-06-19' }))).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.campRegistration.create).not.toHaveBeenCalled();
  });

  it('rechaza el French Canada Tour en programas de menos de 3 semanas', async () => {
    const { service } = build();
    await expect(service.create(dto({ durationWeeks: 2, frenchCanadaTour: true }))).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
