import {
  FEE_BOX, HINTS, LABELS, PASSPORT_NOTICE, SECTION_TITLES, TERMS_ACKNOWLEDGEMENT, TERMS_BLOCKS,
} from '../../config/content';
import { SectionHeader } from '../../components/SectionHeader';
import { CheckboxField, TextField } from '../fields';

export function Step6Terms() {
  return (
    <section className="form-section">
      <SectionHeader title={SECTION_TITLES.terms} />
      <div className="section-body stack">
        <div className="terms-box" tabIndex={0} role="region" aria-label={SECTION_TITLES.terms}>
          {TERMS_BLOCKS.map((block) => (
            <p key={block.title}>
              <strong className="terms-title">{block.title}:</strong> {block.es}{' '}
              <em>{block.en}</em>
            </p>
          ))}
        </div>

        <p className="terms-acknowledgement">
          {TERMS_ACKNOWLEDGEMENT.es}
          <br />
          {TERMS_ACKNOWLEDGEMENT.en}
        </p>

        <div className="grid">
          <CheckboxField name="termsAccepted" label={LABELS.termsAccepted} required className="terms-accept" />
          <TextField
            name="signatureDate"
            label={LABELS.signatureDate}
            hint={HINTS.date}
            type="date"
          />
          <TextField
            name="parentGuardianFullName"
            label={LABELS.parentGuardianFullName}
            autoComplete="name"
          />
          <TextField
            name="parentSignature"
            label={LABELS.parentSignature}
            signature
            autoComplete="off"
          />
        </div>

        <div className="fee-box">
          <span>{FEE_BOX.label}</span>
          <strong>{FEE_BOX.amount}</strong>
          <span>— {FEE_BOX.note}</span>
        </div>

        <div className="notice">
          <p>{PASSPORT_NOTICE.es}</p>
          <p>{PASSPORT_NOTICE.en}</p>
        </div>
      </div>
    </section>
  );
}
