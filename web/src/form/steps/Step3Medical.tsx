import { LABELS, SECTION_TITLES } from '../../config/content';
import { SectionHeader } from '../../components/SectionHeader';
import { TextField } from '../fields';

export function Step3Medical() {
  return (
    <section className="form-section">
      <SectionHeader title={SECTION_TITLES.medical} />
      <div className="section-body grid">
        <TextField name="allergies" label={LABELS.allergies} multiline />
        <TextField name="medicalConditions" label={LABELS.medicalConditions} multiline />
        <TextField name="medications" label={LABELS.medications} multiline />
        <TextField name="specialDietary" label={LABELS.specialDietary} multiline />
      </div>
    </section>
  );
}
