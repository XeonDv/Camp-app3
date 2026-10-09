// Tipos compartidos de toda la aplicación.

export type Gender = 'Male' | 'Female' | 'Other';
export type AccommodationType = 'residence' | 'homestay' | 'day-camper';
export type ParentAccommodation = 'residence' | 'homestay' | 'none';
export type AcademicProgram =
  | 'general-english'
  | 'leadership-entrepreneurship'
  | 'digital-media'
  | 'artificial-intelligence';
export type AirportTransfer = 'arrival' | 'departure' | 'both' | 'none';
export type NightStay =
  | 'students-residence'
  | 'students-homestay'
  | 'parents-residence'
  | 'parents-homestay';
export type PlacementTest = 'take' | 'skip';

export type RegistrationStatus = 'pending' | 'approved' | 'waitlist' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';

/**
 * Estado del formulario en pantalla. Todo son textos (así los <input> funcionan
 * directo); al enviar, buildPayload() lo convierte al formato que espera la API.
 */
export interface FormValues {
  // 1. Estudiante
  studentGivenName: string;
  studentLastName: string;
  studentGender: '' | Gender;
  studentDateOfBirth: string;
  studentNationality: string;
  studentMotherTongue: string;
  studentPassportNumber: string;
  studentHomeAddress: string;
  studentCountry: string;
  studentCity: string;
  studentProvinceState: string;
  studentPostalCode: string;
  studentPhone: string;
  studentEmail: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  emergencyContactRelationship: string;
  currentlyInCanada: '' | 'yes' | 'no';
  canadaAddress: string;

  // 2. Agencia
  agencyName: string;
  agencyContactPerson: string;
  agencyEmail: string;

  // 3. Padres / tutores
  parentFullName: string;
  parentDateOfBirth: string;
  parentEmail: string;
  parentPhone: string;
  parent2FullName: string;
  parent2DateOfBirth: string;
  parent2Email: string;
  parent2Phone: string;

  // 4. Historial médico
  allergies: string;
  medicalConditions: string;
  medications: string;
  specialDietary: string;

  // 5. Centro, fechas y alojamiento
  durationWeeks: '' | '1' | '2' | '3' | '4';
  preferredStartDate: string;
  departureDate: string;
  accommodationType: '' | AccommodationType;
  parentAccommodation: ParentAccommodation;

  // 6. Programa académico
  academicProgram: '' | AcademicProgram;

  // 7. Servicios opcionales
  airportTransfer: AirportTransfer;
  frenchCanadaTour: boolean;
  notarizedCustodyLetter: boolean;
  officialCertificate: boolean;
  additionalNightStays: NightStay[];

  // 8. Prueba de nivel
  placementTest: '' | PlacementTest;

  // 9. Términos y firma
  termsAccepted: boolean;
  signatureDate: string;
  parentGuardianFullName: string;
  parentSignature: string;
}

export type FormErrors = Partial<Record<keyof FormValues, string>>;

/** Claves de FormValues cuyo valor es un texto (para los campos de texto y radios). */
export type StringKey = {
  [K in keyof FormValues]: FormValues[K] extends string ? K : never;
}[keyof FormValues];

/** Respuesta de POST /api/registrations */
export interface CreatedRegistration {
  id: string | number;
  status: string;
  paymentStatus: string;
}

/** Registro tal como lo devuelve la API al administrador (puede ser del formulario antiguo). */
export type Registration = Record<string, unknown> & {
  id: string | number;
  status: string;
  paymentStatus: string;
};

export interface RegistrationList {
  data: Registration[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface RegistrationStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  totalRevenue: number | string | null;
  registrationsByProgram?: unknown;
}
