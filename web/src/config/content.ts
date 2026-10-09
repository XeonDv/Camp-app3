/**
 * TODOS LOS TEXTOS DEL FORMULARIO EN UN SOLO LUGAR.
 * Para cambiar una etiqueta, un precio o un párrafo de los términos, edítalo aquí.
 * El panel de administración reutiliza las mismas etiquetas.
 */
import type { NightStay } from '../types';

// ---------------------------------------------------------------- Generales
export const BRAND = {
  name: 'Young Leaders Camp / YLCamp',
  addressLines: ['421 Eglinton Ave W, Suite #8', 'Toronto, ON M5N 1A4, Canada'],
  passportEmail: 'info.mexico@ylcamp.com',
};

export const FEE = {
  amount: 350,
  currency: 'CAD',
  short: '$350 CAD',
};

export const PAGE_TEXT = {
  title: 'Young Leaders Camp Registration',
  subtitle: 'Formulario de Registro 2027 / Application Form 2027',
  badge: 'Canada Summer Camp 2027',
};

/** Centro fijo (no editable por el usuario). */
export const CAMP_CENTRE = {
  value: 'university-of-toronto',
  label: 'Universidad de Toronto (Toronto, ON)',
} as const;

// ------------------------------------------------------------------- Pasos
export const STEP_TITLES = [
  'Estudiante / Student',
  'Agencia y padres / Agency & parents',
  'Médico / Medical',
  'Programa / Program',
  'Servicios / Services',
  'Firma y pago / Sign & pay',
];

// ---------------------------------------------------- Títulos de secciones
export const SECTION_TITLES = {
  student: '1. INFORMACIÓN DEL ESTUDIANTE / STUDENT INFORMATION',
  agency: '2. INFORMACIÓN DE LA AGENCIA / AGENCY INFORMATION',
  parents: '3. INFORMACIÓN DE PADRES O TUTORES / PARENT / GUARDIAN INFORMATION',
  medical: '4. HISTORIAL MÉDICO / MEDICAL HISTORY',
  centre: '5. CENTRO, FECHAS Y ALOJAMIENTO / CENTRE, DATES & ACCOMMODATION',
  program: '6. PROGRAMA ACADÉMICO / ACADEMIC PROGRAM SELECTION',
  services: '7. SERVICIOS OPCIONALES Y TRASLADOS / OPTIONAL SERVICES & TRANSFERS',
  placement: '8. PRUEBA DE NIVEL DE INGLÉS / ENGLISH PLACEMENT TEST',
  terms: '9. TÉRMINOS, CONDICIONES Y POLÍTICAS / TERMS, CONDITIONS & WAIVERS',
};

// --------------------------------------------------- Etiquetas de los campos
export const LABELS = {
  studentGivenName: 'Nombre / First Name',
  studentLastName: 'Apellidos / Last Name',
  studentGender: 'Género / Gender',
  studentDateOfBirth: 'Fecha de Nacimiento / Date of Birth',
  studentNationality: 'Nacionalidad / Nationality',
  studentMotherTongue: 'Lengua Materna / Mother Tongue',
  studentPassportNumber: 'Número de Pasaporte / Passport #',
  studentHomeAddress: 'Dirección Completa / Full Address',
  studentCountry: 'País / Country',
  studentCity: 'Ciudad / City',
  studentProvinceState: 'Provincia / Estado / Province',
  studentPostalCode: 'Código Postal / Postal Code',
  studentPhone: 'Teléfono / Phone Number',
  studentEmail: 'Email del Estudiante / Student Email',
  emergencyContactName: 'Contacto de Emergencia / Emergency Contact Name',
  emergencyContactPhone: 'Teléfono de Emergencia / Emergency Phone',
  emergencyContactEmail: 'Email de Emergencia / Emergency Email',
  emergencyContactRelationship: 'Relación / Relationship',
  currentlyInCanada: '¿Se encuentra actualmente en Canadá? / Currently in Canada?',
  canadaAddress: 'En caso afirmativo, Dirección en Canadá / If yes, Address in Canada',

  agencyName: 'Nombre de la Agencia / Agency Name',
  agencyContactPerson: 'Persona de Contacto / Contact Person',
  agencyEmail: 'Email del Agente / Agent Email',

  parentFullName: 'PADRE / TUTOR 1 - Nombre Completo / Full Name',
  parentDateOfBirth: 'Fecha de Nacimiento / Date of Birth (Padre/Tutor 1)',
  parentEmail: 'Email (Padre/Tutor 1)',
  parentPhone: 'Teléfono / Phone Number (Padre/Tutor 1)',
  parent2FullName: 'PADRE / TUTOR 2 - Nombre Completo / Full Name',
  parent2DateOfBirth: 'Fecha de Nacimiento / Date of Birth (Padre/Tutor 2)',
  parent2Email: 'Email (Padre/Tutor 2)',
  parent2Phone: 'Teléfono / Phone Number (Padre/Tutor 2)',

  allergies: 'Alergias / Allergies',
  medicalConditions: 'Condición Médica / Medical Condition',
  medications: 'Medicamentos / Medications',
  specialDietary: 'Dieta Especial / Special Diet',

  campCentre: 'Centro de Campamento / Camp Centre',
  durationWeeks: 'Duración / Durations',
  preferredStartDate: 'Fecha de Inicio / Start Date',
  departureDate: 'Fecha de Salida / Departure Date',
  accommodationType: 'Alojamiento del Estudiante / Camper Accommodation',
  parentAccommodation: 'Alojamiento para Padres / Parent Accommodation',

  academicProgram: 'Programa Académico / Academic Program',

  airportTransfer: 'Traslado Aeropuerto / Airport Transfer',
  frenchCanadaTour: 'French Canada Tour ($450 CAD)',
  notarizedCustodyLetter: 'Carta de Custodia Notarizada / Notarized Custodianship Letter ($250 CAD)',
  officialCertificate:
    'Certificado oficial de curso emitido por la Universidad de Toronto (Costo adicional)',
  additionalNightStays: 'Noche Adicional de Alojamiento / Additional Night Stay',

  placementTest: 'Prueba de Nivel de Inglés / English Placement Test',

  termsAccepted: 'SÍ, ACEPTO LOS TÉRMINOS / YES, I ACCEPT THE TERMS',
  signatureDate: 'Fecha / Date',
  parentGuardianFullName: 'Nombre del Padre o Tutor / Parent-Guardian Full Name',
  parentSignature: 'Firma del Padre o Tutor / Parent-Guardian Signature',
} as const;

/** Textos pequeños bajo la etiqueta. */
export const HINTS = {
  studentLastName: '(Como aparece en pasaporte / As in passport)',
  date: '(AAAA/MM/DD)',
  parentAccommodation: '(Opcional / Optional)',
  airportTransfer: '(Incluido en tarifa del programa / Included in fees)',
  frenchCanadaTour:
    'Disponible solo para programas de 3 o 4 semanas / Available only for 3 or 4 week programs.',
};

// --------------------------------------------------------------- Opciones
export interface Option<V extends string = string> {
  value: V;
  label: string;
}

export const OPTIONS = {
  gender: [
    { value: 'Male', label: 'Masculino (M)' },
    { value: 'Female', label: 'Femenino (F)' },
    { value: 'Other', label: 'Otro (O)' },
  ],
  yesNo: [
    { value: 'yes', label: 'Sí / Yes' },
    { value: 'no', label: 'No' },
  ],
  duration: [
    { value: '1', label: '1 Semana / Week' },
    { value: '2', label: '2 Semanas / Weeks' },
    { value: '3', label: '3 Semanas / Weeks' },
    { value: '4', label: '4 Semanas / Weeks' },
  ],
  accommodation: [
    { value: 'residence', label: 'Residencia / Residence' },
    { value: 'homestay', label: 'Casa de Familia / Homestay' },
    { value: 'day-camper', label: 'Estudiante Local / Day Camper (Sin Alojamiento)' },
  ],
  parentAccommodation: [
    { value: 'residence', label: 'Padres en Residencia / Parents in Residence' },
    { value: 'homestay', label: 'Padres en Casa de Familia / Parents in Homestay' },
    { value: 'none', label: 'No requiere / Not Required' },
  ],
  airportTransfer: [
    { value: 'arrival', label: 'Sí, llegada / Yes, arrival day' },
    { value: 'departure', label: 'Sí, salida / Yes, departure day' },
    { value: 'both', label: 'Ambos / Both transfer services' },
    { value: 'none', label: 'No requiere / Not required' },
  ],
  nightStays: [
    { value: 'students-residence', label: 'Estudiantes en Residencia / Students in Residence ($450 CAD)' },
    { value: 'students-homestay', label: 'Estudiantes en Casa de Familia / Students in Homestay ($220 CAD)' },
    { value: 'parents-residence', label: 'Padres en Residencia / Parents in Residence ($360 CAD)' },
    { value: 'parents-homestay', label: 'Padres en Casa de Familia / Parents in Homestay ($170 CAD)' },
  ] as Option<NightStay>[],
  placementTest: [
    {
      value: 'take',
      label: 'Realizar la prueba de nivel en línea. / Take the online placement test.',
    },
    {
      value: 'skip',
      label:
        'No realizar la prueba de nivel y empezar desde el nivel principiante. / Do not take the placement test and start from the Beginner level.',
    },
  ],
} satisfies Record<string, Option[]>;

// ------------------------------------------------------ Programa académico
export const PROGRAM_INTRO =
  'Todos los estudiantes toman clases de inglés. Los estudiantes de 13 a 17 años con nivel avanzado (C1) pueden elegir una de las siguientes academias especializadas / All students take English classes. Advanced students (C1, ages 13-17) may select a specialized academy:';

export const PROGRAMS = [
  {
    value: 'general-english',
    title: 'Inglés General / General English (Todos los niveles / All levels)',
    description:
      'Formación enfocada en el desarrollo integral del idioma inglés: comprensión, expresión oral y escrita, y fluidez comunicativa.',
  },
  {
    value: 'leadership-entrepreneurship',
    title: 'Liderazgo y Emprendimiento / Leadership & Entrepreneurship',
    description:
      'Formación enfocada en liderazgo global, comunicación y desarrollo de proyectos con impacto internacional.',
  },
  {
    value: 'digital-media',
    title: 'Medios Digitales / Digital Media',
    description:
      'Formación en creatividad aplicada al mundo real mediante herramientas de comunicación visual y creación de contenido digital.',
  },
  {
    value: 'artificial-intelligence',
    title: 'Inteligencia Artificial / Artificial intelligence',
    description:
      'Formación enfocada en tecnología, innovación y el futuro digital, donde los jóvenes descubren el poder de la inteligencia artificial de forma práctica y creativa.',
  },
] as const;

// --------------------------------------------------------- Servicios extra
export const SERVICES_TEXT = {
  airportQuestion: '¿Requiere transporte de llegada/salida? / Requires airport transfer?',
  frenchTourDescription: 'Excursión de 3 días y 2 noches a Montreal, Quebec City y Ottawa.',
  frenchTourCheckbox: 'Sí, deseo incluirlo / Yes, add to program',
  additionalServices: 'Servicios Adicionales / Additional Services',
};

// ----------------------------------------------------- Términos y políticas
export interface TermsBlock {
  title: string;
  es: string;
  en: string;
}

export const TERMS_BLOCKS: TermsBlock[] = [
  {
    title: 'Políticas de Cancelación y Reembolso / Cancellation & Refund Policies',
    es: 'El pago de registro de $350 CAD no es reembolsable bajo ninguna circunstancia. La Carta de Custodia ($250 CAD) no es reembolsable después del 1 de enero de 2027. Cancelaciones voluntarias antes del 1 de abril de 2027 aplican penalización del 25%; entre el 1 de abril y 8 semanas antes del campamento, penalización del 50%; menos de 8 semanas antes, penalización del 75%. En caso de rechazo oficial de visa por IRCC se reembolsará el monto excepto registro ($375 CAD en cláusula tardía o $250 CAD estándar) y carta de custodia.',
    en: 'The $350 CAD registration fee is non-refundable under any circumstances. The Custodianship Letter ($250 CAD) is non-refundable after January 1, 2027. Voluntary cancellations before April 1, 2027 are subject to a 25% penalty; after April 1 and more than 8 weeks before start date, 50% penalty; less than 8 weeks before start date, 75% penalty. In case of an official visa refusal by IRCC, fees are refundable except non-refundable items.',
  },
  {
    title: 'Consentimiento de Fotografía y Promoción / Photo & Promotion Consent',
    es: 'Otorgo permiso a Young Leaders Camp para tomar fotografías de mi hijo/a y publicarlas en las redes sociales, así como para material promocional, catálogos y sitios web oficiales. Puedo revocar este consentimiento por escrito.',
    en: 'I grant permission to Young Leaders Camp to take photos of my child and post them to the social media and use them for promotional purposes from time to time. I may opt out by notifying the camp in writing.',
  },
  {
    title: 'Política de Comportamiento del Campista / Camper Behavior Policy',
    es: 'El estudiante debe cumplir estrictamente con las normas de respeto, responsabilidad y cooperación. El incumplimiento grave puede resultar en la expulsión inmediata del campamento, siendo responsabilidad de los padres gestionar y costear el retorno pronto.',
    en: 'The camper must strictly adhere to the rules of respect, responsibility, and cooperation. Severe non-compliance may result in dismissal from camp, and parents agree to arrange and pay for prompt departure.',
  },
  {
    title: 'Límites de Responsabilidad y Riesgo / Liability & Risk Acknowledgment',
    es: 'El campamento cuenta con supervisión 24/7 y seguro médico de emergencia incluido. Sin embargo, no se hace responsable por pérdida, daño o robo de objetos personales (incluyendo servicio de lavandería). Se reconocen y aceptan los riesgos inherentes de las actividades al aire libre y deportes.',
    en: 'The camp provides 24/7 supervision and emergency medical insurance. The camp is not liable for loss, damage, or theft of personal items (including laundry service). Inherent risks of outdoor activities and sports are acknowledged and accepted.',
  },
  {
    // TODO verify: el PDF imprime "Authorization:." (con un punto sobrante) y la frase
    // "no puedo comunicarme conmigo" (probablemente "con él/ella"); se copian tal cual.
    // En el PDF "seguro médico de emergencia" / "emergency medical insurance" son enlaces
    // (destino desconocido); aquí se muestran como texto normal.
    title:
      'Información médica y autorización para tratamiento de emergencia / Medical Information & Emergency Treatment Authorization',
    es: 'Confirmo que he proporcionado información médica precisa y completa sobre mi hijo/a, incluyendo alergias y afecciones médicas relevantes. Entiendo que YLCamp no puede garantizar un entorno libre de alérgenos. Todos los estudiantes cuentan con un seguro médico de emergencia obligatorio durante el campamento, sujeto a los términos y límites de la póliza. Soy responsable de cualquier gasto no cubierto por el seguro. Si mi hijo/a se enferma o se lesiona y no puedo comunicarme conmigo, autorizo al personal de YLCamp a obtener el tratamiento médico necesario, incluyendo atención hospitalaria, medicamentos, pruebas o procedimientos recomendados por profesionales médicos.',
    en: 'I confirm that I have provided accurate and complete medical information for my child, including allergies and relevant medical conditions. I understand that YLCamp cannot guarantee an allergy-free environment. All students are covered by mandatory emergency medical insurance during camp, subject to the policy’s terms and limits. I am responsible for any costs not covered by the insurance. If my child becomes ill or injured and I cannot be reached, I authorize YLCamp staff to obtain necessary medical treatment, including hospital care, medication, tests, or procedures recommended by medical professionals.',
  },
];

export const TERMS_ACKNOWLEDGEMENT = {
  es: 'Al firmar a continuación, confirmo que he leído, entendido y acepto todos los términos y condiciones descritos.',
  en: 'By signing below, I acknowledge that I have read, understood, and agree to all terms and conditions outlined above.',
};

export const FEE_BOX = {
  label: 'Cuota de registro / Registration fee:',
  amount: '$350 CAD',
  note: 'no reembolsable / non-refundable',
};

export const PASSPORT_NOTICE = {
  es: `Por favor envíe este formulario completado y adjunte el pasaporte del estudiante a: ${BRAND.passportEmail}`,
  en: `Please email this completed form and attach the student's passport to: ${BRAND.passportEmail}`,
};

export const SUBMIT_BUTTON = 'Enviar y pagar $350 CAD / Submit & pay $350 CAD';

// ------------------------------------------------- Mensajes de validación
export const MESSAGES = {
  required: 'Campo obligatorio / Required',
  email: 'Email no válido / Invalid email',
  datePast: 'La fecha debe ser anterior a hoy / Date must be in the past',
  dateInvalid: 'Fecha no válida / Invalid date',
  departureAfterStart: 'Debe ser posterior a la fecha de inicio / Must be after the start date',
  termsRequired: 'Debe aceptar los términos / You must accept the terms',
};
