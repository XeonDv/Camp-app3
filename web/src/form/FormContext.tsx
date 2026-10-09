import { createContext, useContext } from 'react';
import type { FormErrors, FormValues } from '../types';

interface FormContextValue {
  values: FormValues;
  errors: FormErrors;
  /** Cambia uno o varios campos (aplica también las reglas entre campos). */
  change: (patch: Partial<FormValues>) => void;
}

export const FormContext = createContext<FormContextValue | null>(null);

export function useForm(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useForm debe usarse dentro de <FormContext.Provider>');
  return ctx;
}
