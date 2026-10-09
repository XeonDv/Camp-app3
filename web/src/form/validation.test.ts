import { describe, expect, it } from 'vitest';
import { initialValues } from './formState';
import { validateAll, validateStep } from './validation';

const TODAY = '2026-10-09';

const step1Ok = {
  studentGivenName: 'Ana',
  studentLastName: 'Pérez',
  studentGender: 'Female' as const,
  studentDateOfBirth: '2012-05-01',
  studentNationality: 'Mexicana',
  studentPassportNumber: 'G12345678',
  studentHomeAddress: 'Calle 1 #2',
  studentCountry: 'México',
  studentCity: 'CDMX',
  studentProvinceState: 'CDMX',
  studentPostalCode: '01000',
  studentPhone: '+52 55 0000 0000',
  emergencyContactName: 'Luis',
  emergencyContactPhone: '+52 55 1111 1111',
  emergencyContactRelationship: 'Tío',
  currentlyInCanada: 'no' as const,
};

describe('validateStep', () => {
  it('pide los datos obligatorios del estudiante', () => {
    const errors = validateStep(1, initialValues(), TODAY);
    expect(errors.studentGivenName).toBeTruthy();
    expect(errors.studentPassportNumber).toBeTruthy();
    expect(errors.currentlyInCanada).toBeTruthy();
  });

  it('acepta el paso 1 completo', () => {
    expect(validateStep(1, { ...initialValues(), ...step1Ok }, TODAY)).toEqual({});
  });

  it('exige la dirección en Canadá solo si ya está en Canadá', () => {
    const values = { ...initialValues(), ...step1Ok, currentlyInCanada: 'yes' as const };
    expect(validateStep(1, values, TODAY).canadaAddress).toBeTruthy();
  });

  it('rechaza una fecha de nacimiento futura', () => {
    const values = { ...initialValues(), ...step1Ok, studentDateOfBirth: '2030-01-01' };
    expect(validateStep(1, values, TODAY).studentDateOfBirth).toBeTruthy();
  });

  it('rechaza un email con formato incorrecto', () => {
    const values = { ...initialValues(), parentFullName: 'M', parentPhone: '1', parentEmail: 'no-es-email' };
    expect(validateStep(2, values, TODAY).parentEmail).toBeTruthy();
  });

  it('exige que la salida sea posterior al inicio', () => {
    const values = {
      ...initialValues(),
      durationWeeks: '2' as const,
      preferredStartDate: '2027-06-19',
      departureDate: '2027-06-19',
      accommodationType: 'residence' as const,
      academicProgram: 'general-english' as const,
    };
    expect(validateStep(4, values, TODAY).departureDate).toBeTruthy();
  });

  it('exige aceptar los términos para enviar', () => {
    expect(validateStep(6, initialValues(), TODAY).termsAccepted).toBeTruthy();
  });
});

describe('validateAll', () => {
  it('devuelve el primer paso con errores', () => {
    expect(validateAll(initialValues(), TODAY)?.step).toBe(1);
  });
});
