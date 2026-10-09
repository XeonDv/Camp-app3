import { safeSession, todayISO } from '../lib';
import type { FormValues } from '../types';

const DRAFT_KEY = 'ylc_form_draft';
const REGISTRATION_ID_KEY = 'ylc_registration_id';

export function initialValues(): FormValues {
  return {
    studentGivenName: '',
    studentLastName: '',
    studentGender: '',
    studentDateOfBirth: '',
    studentNationality: '',
    studentMotherTongue: '',
    studentPassportNumber: '',
    studentHomeAddress: '',
    studentCountry: '',
    studentCity: '',
    studentProvinceState: '',
    studentPostalCode: '',
    studentPhone: '',
    studentEmail: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    emergencyContactRelationship: '',
    currentlyInCanada: '',
    canadaAddress: '',
    agencyName: '',
    agencyContactPerson: '',
    agencyEmail: '',
    parentFullName: '',
    parentDateOfBirth: '',
    parentEmail: '',
    parentPhone: '',
    parent2FullName: '',
    parent2DateOfBirth: '',
    parent2Email: '',
    parent2Phone: '',
    allergies: '',
    medicalConditions: '',
    medications: '',
    specialDietary: '',
    durationWeeks: '',
    preferredStartDate: '',
    departureDate: '',
    accommodationType: '',
    parentAccommodation: 'none',
    academicProgram: '',
    airportTransfer: 'none',
    frenchCanadaTour: false,
    notarizedCustodyLetter: false,
    officialCertificate: false,
    additionalNightStays: [],
    placementTest: '',
    termsAccepted: false,
    signatureDate: todayISO(),
    parentGuardianFullName: '',
    parentSignature: '',
  };
}

/**
 * Aplica un cambio al formulario y las reglas que dependen de otros campos.
 * Regla: el French Canada Tour solo existe para programas de 3 o 4 semanas.
 */
export function updateValues(values: FormValues, patch: Partial<FormValues>): FormValues {
  const next = { ...values, ...patch };
  if (!isFrenchTourAvailable(next.durationWeeks)) {
    next.frenchCanadaTour = false;
  }
  return next;
}

export function isFrenchTourAvailable(durationWeeks: string): boolean {
  return Number(durationWeeks) >= 3;
}

// ----------------------------------------------- Borrador en sessionStorage
export interface Draft {
  values: FormValues;
  step: number;
}

export function loadDraft(): Draft | null {
  const raw = safeSession.get(DRAFT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Draft>;
    if (!parsed.values || typeof parsed.step !== 'number') return null;
    // Mezclamos con los valores iniciales por si el formulario cambió entre versiones.
    return { values: { ...initialValues(), ...parsed.values }, step: parsed.step };
  } catch {
    return null;
  }
}

export function saveDraft(draft: Draft): void {
  safeSession.set(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft(): void {
  safeSession.remove(DRAFT_KEY);
}

// -------------------------------- Registro ya creado, pendiente de pago
export const savedRegistration = {
  get: (): string | null => safeSession.get(REGISTRATION_ID_KEY),
  set: (id: string | number): void => safeSession.set(REGISTRATION_ID_KEY, String(id)),
  clear: (): void => safeSession.remove(REGISTRATION_ID_KEY),
};
