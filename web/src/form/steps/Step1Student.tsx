import { HINTS, LABELS, OPTIONS, SECTION_TITLES } from '../../config/content';
import { SectionHeader } from '../../components/SectionHeader';
import { RadioGroup, TextField } from '../fields';
import { useForm } from '../FormContext';
import { todayISO } from '../../lib';

export function Step1Student() {
  const { values } = useForm();
  const today = todayISO();

  return (
    <section className="form-section">
      <SectionHeader title={SECTION_TITLES.student} />
      <div className="section-body grid">
        <TextField name="studentGivenName" label={LABELS.studentGivenName} autoComplete="given-name" />
        <TextField
          name="studentLastName"
          label={LABELS.studentLastName}
          hint={HINTS.studentLastName}
          autoComplete="family-name"
        />
        <RadioGroup name="studentGender" label={LABELS.studentGender} options={OPTIONS.gender} />
        <TextField
          name="studentDateOfBirth"
          label={LABELS.studentDateOfBirth}
          hint={HINTS.date}
          type="date"
          max={today}
        />
        <TextField name="studentNationality" label={LABELS.studentNationality} />
        <TextField name="studentMotherTongue" label={LABELS.studentMotherTongue} />
        <TextField name="studentPassportNumber" label={LABELS.studentPassportNumber} />
        <TextField name="studentHomeAddress" label={LABELS.studentHomeAddress} autoComplete="street-address" />
        <TextField name="studentCountry" label={LABELS.studentCountry} autoComplete="country-name" />
        <TextField name="studentCity" label={LABELS.studentCity} autoComplete="address-level2" />
        <TextField name="studentProvinceState" label={LABELS.studentProvinceState} autoComplete="address-level1" />
        <TextField name="studentPostalCode" label={LABELS.studentPostalCode} autoComplete="postal-code" />
        <TextField name="studentPhone" label={LABELS.studentPhone} type="tel" autoComplete="tel" />
        <TextField name="studentEmail" label={LABELS.studentEmail} type="email" autoComplete="email" />
        <TextField name="emergencyContactName" label={LABELS.emergencyContactName} />
        <TextField name="emergencyContactPhone" label={LABELS.emergencyContactPhone} type="tel" />
        <TextField name="emergencyContactEmail" label={LABELS.emergencyContactEmail} type="email" />
        <TextField name="emergencyContactRelationship" label={LABELS.emergencyContactRelationship} />
        <RadioGroup name="currentlyInCanada" label={LABELS.currentlyInCanada} options={OPTIONS.yesNo} />
        <TextField
          name="canadaAddress"
          label={LABELS.canadaAddress}
          required={values.currentlyInCanada === 'yes'}
        />
      </div>
    </section>
  );
}
