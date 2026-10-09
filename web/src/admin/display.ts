import { LABELS, OPTIONS } from '../config/content';

/** Secciones del formulario 2027 para mostrar una inscripción completa. */
export const DETAIL_SECTIONS: { title: string; keys: string[] }[] = [
  {
    title: '1. Estudiante / Student',
    keys: [
      'studentGivenName', 'studentLastName', 'studentGender', 'studentDateOfBirth', 'studentNationality',
      'studentMotherTongue', 'studentPassportNumber', 'studentHomeAddress', 'studentCountry', 'studentCity',
      'studentProvinceState', 'studentPostalCode', 'studentPhone', 'studentEmail', 'emergencyContactName',
      'emergencyContactPhone', 'emergencyContactEmail', 'emergencyContactRelationship', 'currentlyInCanada',
      'canadaAddress',
    ],
  },
  { title: '2. Agencia / Agency', keys: ['agencyName', 'agencyContactPerson', 'agencyEmail'] },
  {
    title: '3. Padres o tutores / Parents or guardians',
    keys: [
      'parentFullName', 'parentDateOfBirth', 'parentEmail', 'parentPhone',
      'parent2FullName', 'parent2DateOfBirth', 'parent2Email', 'parent2Phone',
    ],
  },
  { title: '4. Médico / Medical', keys: ['allergies', 'medicalConditions', 'medications', 'specialDietary'] },
  {
    title: '5. Centro, fechas y alojamiento / Centre, dates & accommodation',
    keys: ['campCentre', 'durationWeeks', 'preferredStartDate', 'departureDate', 'accommodationType', 'parentAccommodation'],
  },
  { title: '6. Programa académico / Academic program', keys: ['academicProgram'] },
  {
    title: '7. Servicios / Services',
    keys: ['airportTransfer', 'frenchCanadaTour', 'notarizedCustodyLetter', 'officialCertificate', 'additionalNightStays'],
  },
  { title: '8. Prueba de nivel / Placement test', keys: ['placementTest'] },
  { title: '9. Términos y firma / Terms & signature', keys: ['termsAccepted', 'signatureDate', 'parentGuardianFullName', 'parentSignature'] },
];

/** Datos internos que no se muestran como "datos del formulario". */
export const INTERNAL_KEYS = new Set([
  'id', 'status', 'paymentStatus', 'paymentAmount', 'paidAt', 'notes', 'pdfUrl', 'createdAt', 'updatedAt',
  'registrationDate', 'formVersion', 'stripeSessionId', 'stripePaymentIntentId',
]);

const SHOWN_KEYS = new Set(DETAIL_SECTIONS.flatMap((s) => s.keys));

/** Campos de registros del formulario anterior (2026) que no están en el 2027. */
export function legacyKeys(registration: Record<string, unknown>): string[] {
  return Object.keys(registration).filter(
    (key) => !SHOWN_KEYS.has(key) && !INTERNAL_KEYS.has(key) && registration[key] !== null && registration[key] !== '',
  );
}

export function labelFor(key: string): string {
  return (LABELS as Record<string, string>)[key] ?? key;
}

const ALL_OPTIONS = [
  ...OPTIONS.gender, ...OPTIONS.accommodation, ...OPTIONS.parentAccommodation, ...OPTIONS.airportTransfer,
  ...OPTIONS.nightStays, ...OPTIONS.placementTest,
];
const PROGRAM_NAMES: Record<string, string> = {
  'general-english': 'Inglés General / General English',
  'leadership-entrepreneurship': 'Liderazgo y Emprendimiento / Leadership & Entrepreneurship',
  'digital-media': 'Medios Digitales / Digital Media',
  'artificial-intelligence': 'Inteligencia Artificial / Artificial Intelligence',
};

function optionLabel(value: string): string {
  return PROGRAM_NAMES[value] ?? ALL_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

/** Convierte un valor guardado en texto legible. Devuelve '' si no hay dato. */
export function displayValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'boolean') return value ? 'Sí / Yes' : 'No';
  if (Array.isArray(value)) return value.map((v) => optionLabel(String(v))).join('; ');
  if (key === 'campCentre') return 'Universidad de Toronto (Toronto, ON)';
  if (key === 'durationWeeks') return `${value} ${Number(value) === 1 ? 'semana / week' : 'semanas / weeks'}`;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) return value.slice(0, 10);
  if (typeof value === 'string') return optionLabel(value);
  return String(value);
}

export function studentName(registration: Record<string, unknown>): string {
  return `${String(registration.studentGivenName ?? '')} ${String(registration.studentLastName ?? '')}`.trim() || '—';
}
