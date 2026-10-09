import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Public()
  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  createCheckout(@Body() dto: CreateCheckoutDto) {
    return this.payments.createCheckout(dto.registrationId);
  }

  @Public()
  @Get('status/:id')
  status(@Param('id') id: string) {
    return this.payments.getStatus(id);
  }

  /** Stripe llama aquí cuando un pago se completa. Necesita el cuerpo original (rawBody) para validar la firma. */
  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  webhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature?: string) {
    return this.payments.handleWebhook(req.rawBody, signature);
  }
}
