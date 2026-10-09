/**
 * Campos reutilizables del formulario. Cada uno:
 *  - enlaza la etiqueta con el input (accesibilidad),
 *  - muestra el error con aria-invalid + aria-describedby,
 *  - lee y escribe su valor directamente en el contexto del formulario.
 */
import type { ReactNode } from 'react';
import type { Option } from '../config/content';
import type { FormValues, StringKey } from '../types';
import { useForm } from './FormContext';
import { REQUIRED_FIELDS } from './validation';

const fieldId = (name: string) => `field-${name}`;

function RequiredMark() {
  return (
    <span className="required-mark" aria-hidden="true">
      {' '}*
    </span>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  );
}

// ------------------------------------------------------------- Texto simple
interface TextFieldProps {
  name: StringKey;
  label: string;
  hint?: string;
  type?: 'text' | 'email' | 'tel' | 'date';
  required?: boolean;
  multiline?: boolean;
  autoComplete?: string;
  min?: string;
  max?: string;
  className?: string;
  /** Estilo especial (firma manuscrita). */
  signature?: boolean;
}

export function TextField({
  name, label, hint, type = 'text', required, multiline, autoComplete, min, max, className, signature,
}: TextFieldProps) {
  const { values, errors, change } = useForm();
  const id = fieldId(name);
  const error = errors[name];
  const isRequired = required ?? REQUIRED_FIELDS.includes(name);
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;

  const common = {
    id,
    name,
    value: values[name],
    required: isRequired,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    autoComplete,
    onChange: (e: { target: { value: string } }) =>
      change({ [name]: e.target.value } as Partial<FormValues>),
  };

  return (
    <div className={`field ${className ?? ''}`} data-invalid={error ? 'true' : undefined}>
      <label htmlFor={id}>
        {label}
        {isRequired && <RequiredMark />}
      </label>
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {multiline ? (
        <textarea {...common} rows={3} />
      ) : (
        <input
          {...common}
          type={type}
          min={min}
          max={max}
          className={signature ? 'signature-input' : undefined}
        />
      )}
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

// ------------------------------------------------------- Grupo de opciones
interface RadioGroupProps {
  name: StringKey;
  label: string;
  hint?: string;
  options: readonly Option[];
  required?: boolean;
  /** Opciones en columna (para textos largos). */
  stacked?: boolean;
  description?: ReactNode;
  className?: string;
}

export function RadioGroup({ name, label, hint, options, required, stacked, description, className }: RadioGroupProps) {
  const { values, errors, change } = useForm();
  const id = fieldId(name);
  const error = errors[name];
  const isRequired = required ?? REQUIRED_FIELDS.includes(name);
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      className={`field choice-group ${className ?? ''}`}
      id={id}
      data-invalid={error ? 'true' : undefined}
      aria-describedby={describedBy}
    >
      <legend>
        {label}
        {isRequired && <RequiredMark />}
      </legend>
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {description}
      <div className={stacked ? 'choices stacked' : 'choices'}>
        {options.map((option) => (
          <label key={option.value} className="choice">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={values[name] === option.value}
              aria-invalid={error ? true : undefined}
              onChange={() => change({ [name]: option.value } as Partial<FormValues>)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <ErrorText id={`${id}-error`} message={error} />
    </fieldset>
  );
}

// ------------------------------------------------------ Casilla individual
interface CheckboxFieldProps {
  name: 'frenchCanadaTour' | 'notarizedCustodyLetter' | 'officialCertificate' | 'termsAccepted';
  label: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  className?: string;
}

export function CheckboxField({ name, label, required, disabled, hint, className }: CheckboxFieldProps) {
  const { values, errors, change } = useForm();
  const id = fieldId(name);
  const error = errors[name];
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field ${className ?? ''}`} data-invalid={error ? 'true' : undefined}>
      <label className={`choice${disabled ? ' disabled' : ''}`} htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={values[name]}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => change({ [name]: e.target.checked } as Partial<FormValues>)}
        />
        <span>
          {label}
          {required && <RequiredMark />}
        </span>
      </label>
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

// ----------------------------------------------- Varias casillas (noches extra)
interface CheckboxGroupProps {
  name: 'additionalNightStays';
  label: string;
  options: readonly Option<FormValues['additionalNightStays'][number]>[];
}

export function CheckboxGroup({ name, label, options }: CheckboxGroupProps) {
  const { values, change } = useForm();
  const selected = values[name];

  const toggle = (value: (typeof selected)[number], checked: boolean) => {
    const next = checked ? [...selected, value] : selected.filter((v) => v !== value);
    change({ [name]: next } as Partial<FormValues>);
  };

  return (
    <fieldset className="field choice-group" id={fieldId(name)}>
      <legend>{label}</legend>
      <div className="choices stacked">
        {options.map((option) => (
          <label key={option.value} className="choice">
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={selected.includes(option.value)}
              onChange={(e) => toggle(option.value, e.target.checked)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
