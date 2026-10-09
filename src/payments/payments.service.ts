import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Cobra la cuota de registro (por defecto 350 CAD) con Stripe Checkout.
 * El precio vive SOLO aquí (servidor): el navegador nunca decide cuánto se cobra.
 */
@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: Stripe | null;
  private readonly feeCents: number;
  private readonly currency = 'cad';

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const key = this.config.get<string>('STRIPE_SECRET_KEY');
    this.stripe = key ? new Stripe(key) : null;
    this.feeCents = Number(this.config.get('REGISTRATION_FEE_CENTS') ?? 35000);

    if (!key) this.logger.warn('⚠️ STRIPE_SECRET_KEY no está configurada: los pagos están desactivados');
  }

  private requireStripe(): Stripe {
    if (!this.stripe) {
      throw new ServiceUnavailableException('Payments are not configured yet');
    }
    return this.stripe;
  }

  /** Crea la sesión de pago y devuelve la dirección de Stripe a la que hay que enviar al usuario. */
  async createCheckout(registrationId: string): Promise<{ url: string }> {
    const stripe = this.requireStripe();

    const registration = await this.prisma.campRegistration.findUnique({
      where: { id: registrationId },
      select: { id: true, parentEmail: true, paymentStatus: true },
    });
    if (!registration) throw new NotFoundException('Registration not found');
    if (registration.paymentStatus === 'paid') {
      throw new ConflictException('This registration has already been paid');
    }

    const baseUrl = (this.config.get<string>('FRONTEND_URL') ?? '').replace(/\/+$/, '');
    if (!/^https?:\/\//.test(baseUrl)) {
      throw new ServiceUnavailableException('FRONTEND_URL is not configured');
    }
    const id = encodeURIComponent(registration.id);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      client_reference_id: registration.id,
      customer_email: registration.parentEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: this.currency,
            unit_amount: this.feeCents,
            product_data: { name: 'Young Leaders Camp 2027 – Registration Fee' },
          },
        },
      ],
      metadata: { registrationId: registration.id },
      payment_intent_data: { metadata: { registrationId: registration.id } },
      success_url: `${baseUrl}/payment/success?id=${id}`,
      cancel_url: `${baseUrl}/payment/cancelled?id=${id}`,
    });

    await this.prisma.campRegistration.update({
      where: { id: registration.id },
      data: { stripeSessionId: session.id },
    });

    this.logger.log(`💳 Checkout session created for ${registration.id}`);
    return { url: session.url };
  }

  /**
   * Estado de pago para la página de "pago recibido". Si el aviso (webhook) de Stripe
   * todavía no llegó, se le pregunta a Stripe directamente, así la página no depende de él.
   */
  async getStatus(registrationId: string): Promise<{ paymentStatus: string }> {
    const registration = await this.prisma.campRegistration.findUnique({
      where: { id: registrationId },
      select: { paymentStatus: true, stripeSessionId: true },
    });
    if (!registration) throw new NotFoundException('Registration not found');

    if (registration.paymentStatus === 'unpaid' && registration.stripeSessionId && this.stripe) {
      try {
        const session = await this.stripe.checkout.sessions.retrieve(registration.stripeSessionId);
        if (session.payment_status === 'paid') {
          await this.markPaid(registrationId, session);
          return { paymentStatus: 'paid' };
        }
      } catch (error) {
        this.logger.warn(`No se pudo consultar a Stripe por ${registrationId}: ${(error as Error).message}`);
      }
    }
    return { paymentStatus: registration.paymentStatus };
  }

  /** Recibe los avisos de Stripe. Solo acepta los que traen una firma válida. */
  async handleWebhook(rawBody: Buffer | undefined, signature: string | undefined): Promise<{ received: true }> {
    const stripe = this.requireStripe();
    const secret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!secret) throw new ServiceUnavailableException('Webhook secret is not configured');
    if (!rawBody || !signature) throw new BadRequestException('Missing payload or signature');

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch (error) {
      this.logger.warn(`⚠️ Webhook con firma inválida: ${(error as Error).message}`);
      throw new BadRequestException('Invalid signature');
    }

    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      const registrationId = session.metadata?.registrationId ?? session.client_reference_id;

      if (session.payment_status === 'paid' && registrationId) {
        await this.markPaid(registrationId, session);
      }
    }

    return { received: true };
  }

  /** Marca la inscripción como pagada. Es seguro llamarlo varias veces para el mismo pago. */
  private async markPaid(registrationId: string, session: Stripe.Checkout.Session) {
    if (session.amount_total !== this.feeCents || session.currency !== this.currency) {
      this.logger.error(
        `❌ Monto inesperado para ${registrationId}: ${session.amount_total} ${session.currency} (se esperaba ${this.feeCents} ${this.currency}). No se marcó como pagado; revíselo en Stripe.`,
      );
      return;
    }

    const paymentIntent =
      typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;

    // Solo cambia si estaba pendiente: un pago repetido o un reembolso manual no se pisan.
    const { count } = await this.prisma.campRegistration.updateMany({
      where: { id: registrationId, paymentStatus: { in: ['unpaid', 'partial'] } },
      data: {
        paymentStatus: 'paid',
        paymentAmount: session.amount_total / 100,
        paidAt: new Date(),
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntent ?? null,
      },
    });

    if (count > 0) this.logger.log(`✅ Pago confirmado para ${registrationId}`);
  }
}
