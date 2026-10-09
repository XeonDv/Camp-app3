import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';

const WEBHOOK_SECRET = 'whsec_test_secret';

function build() {
  const env: Record<string, string> = {
    STRIPE_SECRET_KEY: 'sk_test_dummy',
    STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET,
    FRONTEND_URL: 'https://test.example.com',
  };
  const config = { get: (key: string) => env[key] };
  const prisma = {
    campRegistration: {
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  };
  return { service: new PaymentsService(prisma as any, config as any), prisma };
}

/** Un aviso de Stripe firmado igual que lo hace Stripe de verdad. */
function signedEvent(sessionOverrides: Record<string, unknown> = {}) {
  const payload = JSON.stringify({
    id: 'evt_1',
    object: 'event',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_1',
        object: 'checkout.session',
        payment_status: 'paid',
        amount_total: 35000,
        currency: 'cad',
        payment_intent: 'pi_1',
        metadata: { registrationId: 'YLC-2027-ABC' },
        ...sessionOverrides,
      },
    },
  });
  const header = new Stripe('sk_test_dummy').webhooks.generateTestHeaderString({
    payload,
    secret: WEBHOOK_SECRET,
  });
  return { body: Buffer.from(payload), header };
}

describe('PaymentsService.handleWebhook', () => {
  it('marca la inscripción como pagada con firma válida y 350 CAD', async () => {
    const { service, prisma } = build();
    const { body, header } = signedEvent();

    await expect(service.handleWebhook(body, header)).resolves.toEqual({ received: true });

    expect(prisma.campRegistration.updateMany).toHaveBeenCalledTimes(1);
    const call = prisma.campRegistration.updateMany.mock.calls[0][0];
    expect(call.where.id).toBe('YLC-2027-ABC');
    expect(call.data.paymentStatus).toBe('paid');
    expect(call.data.paymentAmount).toBe(350);
    expect(call.data.stripePaymentIntentId).toBe('pi_1');
  });

  it('rechaza un aviso con firma inválida y no cambia nada', async () => {
    const { service, prisma } = build();
    const { body } = signedEvent();

    await expect(service.handleWebhook(body, 't=1,v1=firma-falsa')).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.campRegistration.updateMany).not.toHaveBeenCalled();
  });

  it('no marca como pagado si el monto no es el esperado', async () => {
    const { service, prisma } = build();
    const { body, header } = signedEvent({ amount_total: 100 });

    await service.handleWebhook(body, header);
    expect(prisma.campRegistration.updateMany).not.toHaveBeenCalled();
  });

  it('ignora sesiones cuyo pago no se completó', async () => {
    const { service, prisma } = build();
    const { body, header } = signedEvent({ payment_status: 'unpaid' });

    await service.handleWebhook(body, header);
    expect(prisma.campRegistration.updateMany).not.toHaveBeenCalled();
  });
});

describe('PaymentsService.createCheckout', () => {
  it('responde 404 si la inscripción no existe', async () => {
    const { service, prisma } = build();
    prisma.campRegistration.findUnique.mockResolvedValue(null);

    await expect(service.createCheckout('YLC-2027-NOPE')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('no permite pagar dos veces la misma inscripción', async () => {
    const { service, prisma } = build();
    prisma.campRegistration.findUnique.mockResolvedValue({
      id: 'YLC-2027-ABC',
      parentEmail: 'madre@example.com',
      paymentStatus: 'paid',
    });

    await expect(service.createCheckout('YLC-2027-ABC')).rejects.toBeInstanceOf(ConflictException);
  });
});
