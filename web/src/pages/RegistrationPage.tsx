import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../api/http';
import { createRegistration } from '../api/public';
import { useCheckout } from '../api/useCheckout';
import { ErrorList } from '../components/ErrorList';
import { PendingPayment } from '../components/PendingPayment';
import { ProgressBar } from '../components/ProgressBar';
import { PAGE_TEXT, STEP_TITLES, SUBMIT_BUTTON } from '../config/content';
import { FormContext } from '../form/FormContext';
import {
  clearDraft, initialValues, loadDraft, saveDraft, savedRegistration, updateValues,
} from '../form/formState';
import { buildPayload } from '../form/payload';
import { Step1Student } from '../form/steps/Step1Student';
import { Step2AgencyParents } from '../form/steps/Step2AgencyParents';
import { Step3Medical } from '../form/steps/Step3Medical';
import { Step4Program } from '../form/steps/Step4Program';
import { Step5Services } from '../form/steps/Step5Services';
import { Step6Terms } from '../form/steps/Step6Terms';
import { TOTAL_STEPS, validateAll, validateStep } from '../form/validation';
import type { FormErrors, FormValues } from '../types';

const STEP_COMPONENTS = [Step1Student, Step2AgencyParents, Step3Medical, Step4Program, Step5Services, Step6Terms];

/** Lleva el foco (y la vista) al primer campo con error. */
function focusFirstError() {
  setTimeout(() => {
    const wrapper = document.querySelector<HTMLElement>('[data-invalid="true"]');
    if (!wrapper) return;
    wrapper.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    const target = wrapper.matches('input,select,textarea')
      ? wrapper
      : wrapper.querySelector<HTMLElement>('input,select,textarea');
    target?.focus({ preventScroll: true });
  }, 0);
}

export function RegistrationPage() {
  const [draft] = useState(loadDraft);
  const [values, setValues] = useState<FormValues>(draft?.values ?? initialValues());
  const [step, setStep] = useState(Math.min(Math.max(draft?.step ?? 1, 1), TOTAL_STEPS));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(savedRegistration.get());
  const checkout = useCheckout();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Guardamos el borrador en sessionStorage para sobrevivir a un refresco accidental.
  useEffect(() => {
    if (!pendingId) saveDraft({ values, step });
  }, [values, step, pendingId]);

  // Al cambiar de paso, el foco va al encabezado del paso (accesibilidad).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView?.({ block: 'start' });
  }, [step]);

  const change = useCallback((patch: Partial<FormValues>) => {
    setValues((current) => updateValues(current, patch));
    setErrors((current) => {
      const keys = Object.keys(patch) as (keyof FormValues)[];
      if (!keys.some((k) => current[k])) return current;
      const next = { ...current };
      keys.forEach((k) => delete next[k]);
      return next;
    });
  }, []);

  const goNext = () => {
    const stepErrors = validateStep(step, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      focusFirstError();
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    const problem = validateAll(values);
    if (problem) {
      setStep(problem.step);
      setErrors(problem.errors);
      focusFirstError();
      return;
    }

    setSubmitting(true);
    setServerErrors([]);
    try {
      const created = await createRegistration(buildPayload(values));
      // El registro ya existe: guardamos su id y borramos el borrador.
      savedRegistration.set(created.id);
      clearDraft();
      setPendingId(String(created.id));
      void checkout.start(created.id);
    } catch (error) {
      setServerErrors(error instanceof ApiError ? error.messages : ['Error inesperado. / Unexpected error.']);
    } finally {
      setSubmitting(false);
    }
  };

  const startNewRegistration = () => {
    if (!window.confirm('¿Empezar un registro nuevo? / Start a new registration?')) return;
    savedRegistration.clear();
    clearDraft();
    setValues(initialValues());
    setStep(1);
    setErrors({});
    setPendingId(null);
  };

  if (pendingId) {
    return (
      <PendingPayment
        registrationId={pendingId}
        loading={checkout.loading}
        errors={checkout.errors}
        onRetry={() => void checkout.start(pendingId)}
        onNewRegistration={startNewRegistration}
      />
    );
  }

  const StepComponent = STEP_COMPONENTS[step - 1];
  const isLast = step === TOTAL_STEPS;

  return (
    <>
      <div className="hero">
        <span className="badge">{PAGE_TEXT.badge}</span>
        <h1>{PAGE_TEXT.title}</h1>
        <p className="hero-sub">{PAGE_TEXT.subtitle}</p>
      </div>

      <ProgressBar step={step} />

      <FormContext.Provider value={{ values, errors, change }}>
        <form
          className="card form-card"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (isLast) void handleSubmit();
            else goNext();
          }}
        >
          <h2 className="step-heading" tabIndex={-1} ref={headingRef}>
            Paso {step} de {TOTAL_STEPS} / Step {step} of {TOTAL_STEPS} — {STEP_TITLES[step - 1]}
          </h2>

          {Object.keys(errors).length > 0 && (
            <p className="alert alert-error" role="alert">
              Revise los campos marcados en rojo. / Please review the highlighted fields.
            </p>
          )}

          <StepComponent />

          {isLast && <ErrorList messages={serverErrors} title="No se pudo enviar el registro. / The registration could not be sent." />}

          <div className="form-nav">
            {step > 1 ? (
              <button type="button" className="btn btn-ghost" onClick={goBack} disabled={submitting}>
                ← Atrás / Back
              </button>
            ) : (
              <span />
            )}
            {isLast ? (
              <button type="submit" className="btn btn-primary btn-large" disabled={submitting}>
                {submitting ? 'Enviando… / Sending…' : SUBMIT_BUTTON}
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">
                Siguiente / Next →
              </button>
            )}
          </div>
        </form>
      </FormContext.Provider>
    </>
  );
}
