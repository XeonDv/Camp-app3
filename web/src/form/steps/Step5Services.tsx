import { HINTS, LABELS, OPTIONS, SECTION_TITLES, SERVICES_TEXT } from '../../config/content';
import { SectionHeader } from '../../components/SectionHeader';
import { CheckboxField, CheckboxGroup, RadioGroup } from '../fields';
import { useForm } from '../FormContext';
import { isFrenchTourAvailable } from '../formState';

export function Step5Services() {
  const { values } = useForm();
  const frenchTourAvailable = isFrenchTourAvailable(values.durationWeeks);

  return (
    <>
      <section className="form-section">
        <SectionHeader title={SECTION_TITLES.services} />
        <div className="section-body stack">
          <RadioGroup
            name="airportTransfer"
            label={LABELS.airportTransfer}
            hint={HINTS.airportTransfer}
            description={<p className="field-note">{SERVICES_TEXT.airportQuestion}</p>}
            options={OPTIONS.airportTransfer}
          />

          <div className="service-block">
            <p className="label-text">{LABELS.frenchCanadaTour}</p>
            <p className="field-note">{SERVICES_TEXT.frenchTourDescription}</p>
            <CheckboxField
              name="frenchCanadaTour"
              label={SERVICES_TEXT.frenchTourCheckbox}
              disabled={!frenchTourAvailable}
              hint={HINTS.frenchCanadaTour}
            />
          </div>

          <div className="service-block">
            <p className="label-text">{SERVICES_TEXT.additionalServices}</p>
            <CheckboxField name="notarizedCustodyLetter" label={LABELS.notarizedCustodyLetter} />
            <CheckboxField name="officialCertificate" label={LABELS.officialCertificate} />
          </div>

          <CheckboxGroup
            name="additionalNightStays"
            label={LABELS.additionalNightStays}
            options={OPTIONS.nightStays}
          />
        </div>
      </section>

      <section className="form-section">
        <SectionHeader title={SECTION_TITLES.placement} />
        <div className="section-body">
          <RadioGroup
            name="placementTest"
            label={LABELS.placementTest}
            options={OPTIONS.placementTest}
            stacked
          />
        </div>
      </section>
    </>
  );
}
