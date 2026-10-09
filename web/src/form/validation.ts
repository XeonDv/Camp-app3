import { MESSAGES } from '../config/content';
import { isValidEmail, isValidISODate, todayISO } from '../lib';
import type { FormErrors, FormValues } from '../types';

export const TOTAL_STEPS = 6;

/** Campos obligatorios (la dirección en Canadá se exige solo si currentlyInCanada = "yes"). */
export const REQUIRED_FIELDS: readonly (keyof FormValues)[] = [
  'studentGivenName',
  'studentLastName',
  'studentGender',
  'studentDateOfBirth',
  'studentNationality',
  'studentPassportNumber',
  'studentHomeAddress',
  'studentCountry',
  'studentCity',
  'studentProvinceState',
  'studentPostalCode',
  'studentPhone',
  'emergencyContactName',
  'emergencyContactPhone',
  'emergencyContactRelationship',
  'currentlyInCanada',
  'parentFullName',
  'parentEmail',
  'parentPhone',
  'durationWeeks',
  'preferredStartDate',
  'departureDate',
  'accommodationType',
  'academicProgram',
  'placementTest',
  'termsAccepted',
  'signatureDate',
  'parentGuardianFullName',
  'parentSignature',
];

/** Campos que se revisan en cada paso. */
const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: [
    'studentGivenName', 'studentLastName', 'studentGender', 'studentDateOfBirth',
    'studentNationality', 'studentPassportNumber', 'studentHomeAddress', 'studentCountry',
    'studentCity', 'studentProvinceState', 'studentPostalCode', 'studentPhone', 'studentEmail',
    'emergencyContactName', 'emergencyContactPhone', 'emergencyContactEmail',
    'emergencyContactRelationship', 'currentlyInCanada', 'canadaAddress',
  ],
  2: ['agencyEmail', 'parentFullName', 'parentEmail', 'parentPhone', 'parent2Email'],
  3: [],
  4: ['durationWeeks', 'preferredStartDate', 'departureDate', 'accommodationType', 'academicProgram'],
  5: ['placementTest'],
  6: ['termsAccepted', 'signatureDate', 'parentGuardianFullName', 'parentSignature'],
};

const OPTIONAL_EMAILS: (keyof FormValues)[] = [
  'studentEmail', 'emergencyContactEmail', 'agencyEmail', 'parent2Email',
];

function isEmpty(value: unknown): boolean {
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'boolean') return !value;
  return value == null;
}

/** Devuelve los errores de un paso (objeto vacío = el paso es válido). */
export function validateStep(step: number, values: FormValues, today: string = todayISO()): FormErrors {
  const errors: FormErrors = {};
  const fields = STEP_FIELDS[step] ?? [];

  for (const field of fields) {
    const isRequired =
      REQUIRED_FIELDS.includes(field) || (field === 'canadaAddress' && values.currentlyInCanada === 'yes');
    if (isRequired && isEmpty(values[field])) {
      errors[field] = field === 'termsAccepted' ? MESSAGES.termsRequired : MESSAGES.required;
    }
  }

  // Emails (solo si se escribieron).
  for (const field of OPTIONAL_EMAILS.concat('parentEmail')) {
    if (!fields.includes(field) || errors[field]) continue;
    const value = String(values[field] ?? '');
    if (value.trim() !== '' && !isValidEmail(value)) errors[field] = MESSAGES.email;
  }

  // Fechas.
  if (fields.includes('studentDateOfBirth') && !errors.studentDateOfBirth) {
    const dob = values.studentDateOfBirth;
    if (!isValidISODate(dob)) errors.studentDateOfBirth = MESSAGES.dateInvalid;
    else if (dob >= today) errors.studentDateOfBirth = MESSAGES.datePast;
  }
  if (fields.includes('preferredStartDate') && !errors.preferredStartDate) {
    if (!isValidISODate(values.preferredStartDate)) errors.preferredStartDate = MESSAGES.dateInvalid;
  }
  if (fields.includes('departureDate') && !errors.departureDate) {
    if (!isValidISODate(values.departureDate)) errors.departureDate = MESSAGES.dateInvalid;
    else if (isValidISODate(values.preferredStartDate) && values.departureDate <= values.preferredStartDate) {
      errors.departureDate = MESSAGES.departureAfterStart;
    }
  }
  if (fields.includes('signatureDate') && !errors.signatureDate) {
    if (!isValidISODate(values.signatureDate)) errors.signatureDate = MESSAGES.dateInvalid;
  }

  return errors;
}

/** Revisa todos los pasos. Devuelve el primer paso con errores (o null). */
export function validateAll(values: FormValues, today: string = todayISO()) {
  for (let step = 1; step <= TOTAL_STEPS; step++) {
    const errors = validateStep(step, values, today);
    if (Object.keys(errors).length > 0) return { step, errors };
  }
  return null;
}
