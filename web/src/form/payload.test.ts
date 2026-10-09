import { describe, expect, it } from 'vitest';
import { initialValues, updateValues } from './formState';
import { buildPayload } from './payload';

describe('buildPayload', () => {
  it('omite los textos opcionales vacíos y convierte tipos', () => {
    const values = {
      ...initialValues(),
      studentGivenName: '  Ana  ',
      durationWeeks: '3' as const,
      currentlyInCanada: 'no' as const,
      canadaAddress: 'no se debe enviar',
    };
    const payload = buildPayload(values);

    expect(payload.studentGivenName).toBe('Ana');
    expect(payload.durationWeeks).toBe(3);
    expect(payload.currentlyInCanada).toBe(false);
    expect(payload).not.toHaveProperty('studentEmail');
    expect(payload).not.toHaveProperty('canadaAddress');
    expect(payload.campCentre).toBe('university-of-toronto');
  });

  it('envía la dirección en Canadá solo cuando corresponde', () => {
    const payload = buildPayload({
      ...initialValues(),
      currentlyInCanada: 'yes',
      canadaAddress: '1 Main St, Toronto',
    });
    expect(payload.currentlyInCanada).toBe(true);
    expect(payload.canadaAddress).toBe('1 Main St, Toronto');
  });
});

describe('updateValues', () => {
  it('desactiva el French Canada Tour si el programa dura menos de 3 semanas', () => {
    const base = updateValues(initialValues(), { durationWeeks: '4', frenchCanadaTour: true });
    expect(base.frenchCanadaTour).toBe(true);
    expect(updateValues(base, { durationWeeks: '2' }).frenchCanadaTour).toBe(false);
  });
});
