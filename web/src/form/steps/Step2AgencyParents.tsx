import { HINTS, LABELS, SECTION_TITLES } from '../../config/content';
import { SectionHeader } from '../../components/SectionHeader';
import { todayISO } from '../../lib';
import { TextField } from '../fields';

export function Step2AgencyParents() {
  const today = todayISO();
  return (
    <>
      <section className="form-section">
        <SectionHeader title={SECTION_TITLES.agency} />
        <div className="section-body grid grid-3">
          <TextField name="agencyName" label={LABELS.agencyName} />
          <TextField name="agencyContactPerson" label={LABELS.agencyContactPerson} />
          <TextField name="agencyEmail" label={LABELS.agencyEmail} type="email" />
        </div>
      </section>

      <section className="form-section">
        <SectionHeader title={SECTION_TITLES.parents} />
        <div className="section-body grid">
          <TextField name="parentFullName" label={LABELS.parentFullName} autoComplete="name" />
          <TextField
            name="parentDateOfBirth"
            label={LABELS.parentDateOfBirth}
            hint={HINTS.date}
            type="date"
            max={today}
          />
          <TextField name="parentEmail" label={LABELS.parentEmail} type="email" autoComplete="email" />
          <TextField name="parentPhone" label={LABELS.parentPhone} type="tel" autoComplete="tel" />
          <hr className="divider full" />
          <TextField name="parent2FullName" label={LABELS.parent2FullName} />
          <TextField
            name="parent2DateOfBirth"
            label={LABELS.parent2DateOfBirth}
            hint={HINTS.date}
            type="date"
            max={today}
          />
          <TextField name="parent2Email" label={LABELS.parent2Email} type="email" />
          <TextField name="parent2Phone" label={LABELS.parent2Phone} type="tel" />
        </div>
      </section>
    </>
  );
}
