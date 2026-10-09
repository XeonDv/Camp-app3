import { CAMP_CENTRE } from '../config/content';
import type { FormValues } from '../types';

/** Campos de texto opcionales: se omiten si están vacíos. */
const OPTIONAL_TEXT_FIELDS = [
  'studentMotherTongue', 'studentEmail', 'emergencyContactEmail',
  'agencyName', 'agencyContactPerson', 'agencyEmail',
  'parentDateOfBirth', 'parent2FullName', 'parent2DateOfBirth', 'parent2Email', 'parent2Phone',
  'allergies', 'medicalConditions', 'medications', 'specialDietary',
] as const;

/** Campos de texto obligatorios (se envían recortados de espacios). */
const REQUIRED_TEXT_FIELDS = [
  'studentGivenName', 'studentLastName', 'studentGender', 'studentDateOfBirth',
  'studentNationality', 'studentPassportNumber', 'studentHomeAddress', 'studentCountry',
  'studentCity', 'studentProvinceState', 'studentPostalCode', 'studentPhone',
  'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship',
  'parentFullName', 'parentEmail', 'parentPhone',
  'preferredStartDate', 'departureDate', 'accommodationType', 'parentAccommodation',
  'academicProgram', 'airportTransfer', 'placementTest',
  'signatureDate', 'parentGuardianFullName', 'parentSignature',
] as const;

/**
 * Convierte el estado del formulario en el cuerpo JSON de POST /api/registrations.
 * El backend rechaza campos desconocidos, así que solo se envían los del contrato.
 */
export function buildPayload(values: FormValues): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const key of REQUIRED_TEXT_FIELDS) payload[key] = values[key].trim();

  for (const key of OPTIONAL_TEXT_FIELDS) {
    const text = values[key].trim();
    if (text !== '') payload[key] = text;
  }

  payload.currentlyInCanada = values.currentlyInCanada === 'yes';
  if (values.currentlyInCanada === 'yes' && values.canadaAddress.trim() !== '') {
    payload.canadaAddress = values.canadaAddress.trim();
  }

  payload.campCentre = CAMP_CENTRE.value;
  payload.durationWeeks = Number(values.durationWeeks);

  payload.frenchCanadaTour = values.frenchCanadaTour;
  payload.notarizedCustodyLetter = values.notarizedCustodyLetter;
  payload.officialCertificate = values.officialCertificate;
  payload.additionalNightStays = values.additionalNightStays;
  payload.termsAccepted = values.termsAccepted;

  return payload;
}
