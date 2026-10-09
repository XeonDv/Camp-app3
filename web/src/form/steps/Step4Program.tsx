import {
  CAMP_CENTRE, HINTS, LABELS, OPTIONS, PROGRAMS, PROGRAM_INTRO, SECTION_TITLES,
} from '../../config/content';
import { SectionHeader } from '../../components/SectionHeader';
import { useForm } from '../FormContext';
import { RadioGroup, TextField } from '../fields';
import type { FormValues } from '../../types';

export function Step4Program() {
  const { values, errors, change } = useForm();
  const programError = errors.academicProgram;

  return (
    <>
      <section className="form-section">
        <SectionHeader title={SECTION_TITLES.centre} />
        <div className="section-body grid">
          <div className="field full">
            <span className="label-text">{LABELS.campCentre}</span>
            <p className="fixed-centre">☒ {CAMP_CENTRE.label}</p>
          </div>
          <RadioGroup
            name="durationWeeks"
            label={LABELS.durationWeeks}
            options={OPTIONS.duration}
            className="full"
          />
          <TextField
            name="preferredStartDate"
            label={LABELS.preferredStartDate}
            hint={HINTS.date}
            type="date"
          />
          <TextField
            name="departureDate"
            label={LABELS.departureDate}
            hint={HINTS.date}
            type="date"
            min={values.preferredStartDate || undefined}
          />
          <RadioGroup
            name="accommodationType"
            label={LABELS.accommodationType}
            options={OPTIONS.accommodation}
            stacked
          />
          <RadioGroup
            name="parentAccommodation"
            label={LABELS.parentAccommodation}
            hint={HINTS.parentAccommodation}
            options={OPTIONS.parentAccommodation}
            stacked
          />
        </div>
      </section>

      <section className="form-section">
        <SectionHeader title={SECTION_TITLES.program} />
        <div className="section-body">
          <p className="program-intro">{PROGRAM_INTRO}</p>
          <fieldset
            className="field choice-group"
            id="field-academicProgram"
            data-invalid={programError ? 'true' : undefined}
            aria-describedby={programError ? 'field-academicProgram-error' : undefined}
          >
            <legend className="visually-hidden">{LABELS.academicProgram}</legend>
            <div className="program-cards">
              {PROGRAMS.map((program) => {
                const selected = values.academicProgram === program.value;
                return (
                  <label key={program.value} className={`program-card${selected ? ' selected' : ''}`}>
                    <input
                      type="radio"
                      name="academicProgram"
                      value={program.value}
                      checked={selected}
                      aria-invalid={programError ? true : undefined}
                      onChange={() => change({ academicProgram: program.value } as Partial<FormValues>)}
                    />
                    <span className="program-text">
                      <span className="program-title">{program.title}</span>
                      <span className="program-desc">{program.description}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            {programError && (
              <p id="field-academicProgram-error" className="field-error">{programError}</p>
            )}
          </fieldset>
        </div>
      </section>
    </>
  );
}
