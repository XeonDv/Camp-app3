import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(private prisma: PrismaService) {}

  async getRegistrationStats() {
    this.logger.log('📊 Fetching registration statistics');
    
    const [
      totalRegistrations,
      pendingRegistrations,
      approvedRegistrations,
      registrations,
    ] = await Promise.all([
      this.prisma.campRegistration.count(),
      this.prisma.campRegistration.count({
        where: { status: 'pending' },
      }),
      this.prisma.campRegistration.count({
        where: { status: 'approved' },
      }),
      this.prisma.campRegistration.findMany({
        select: {
          status: true,
          paymentStatus: true,
          paymentAmount: true,
          campId: true,
        },
      }),
    ]);

    const totalRevenue = registrations
      .filter((r) => r.paymentStatus === 'paid' && r.paymentAmount)
      .reduce((sum, r) => sum + Number(r.paymentAmount || 0), 0);

    const registrationsByProgram: Record<string, number> = {};
    registrations.forEach((reg) => {
      const program = reg.campId || 'unknown';
      registrationsByProgram[program] =
        (registrationsByProgram[program] || 0) + 1;
    });

    this.logger.log(`✅ Statistics generated - Total: ${totalRegistrations}, Pending: ${pendingRegistrations}, Approved: ${approvedRegistrations}, Revenue: $${totalRevenue}`);

    return {
      totalRegistrations,
      pendingRegistrations,
      approvedRegistrations,
      totalRevenue,
      capacityUtilization: 0,
      registrationsByProgram,
    };
  }
}
