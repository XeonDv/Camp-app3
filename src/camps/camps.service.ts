import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampDto } from './dto/create-camp.dto';
import { UpdateCampDto } from './dto/update-camp.dto';

@Injectable()
export class CampsService {
  private readonly logger = new Logger(CampsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createCampDto: CreateCampDto) {
    this.logger.log(`🏕️ Creating new camp program: ${createCampDto.name}`);
    
    const camp = await this.prisma.campProgram.create({
      data: {
        name: createCampDto.name,
        description: createCampDto.description,
        dates: createCampDto.dates as unknown as Prisma.InputJsonValue,
        capacity: createCampDto.capacity,
        ageRangeMin: createCampDto.ageRangeMin,
        ageRangeMax: createCampDto.ageRangeMax,
        price: createCampDto.price,
        status: createCampDto.status || 'open',
      },
    });

    this.logger.log(`✅ Camp program created: ${camp.id} - ${camp.name}`);
    return camp;
  }

  async findAll() {
    this.logger.debug('🔍 Fetching all camp programs');
    
    const camps = await this.prisma.campProgram.findMany({
      orderBy: { createdAt: 'asc' },
    });

    this.logger.log(`✅ Found ${camps.length} camp program(s)`);
    return camps;
  }

  async findOne(id: string) {
    this.logger.debug(`🔍 Fetching camp program: ${id}`);
    
    const camp = await this.prisma.campProgram.findUnique({
      where: { id },
    });

    if (!camp) {
      this.logger.warn(`⚠️ Camp program not found: ${id}`);
      throw new NotFoundException(`Camp with ID ${id} not found`);
    }

    this.logger.debug(`✅ Camp program found: ${id} - ${camp.name}`);
    return camp;
  }

  async update(id: string, updateCampDto: UpdateCampDto) {
    this.logger.log(`🔄 Updating camp program: ${id}`);
    
    await this.findOne(id);

    const updateData: Prisma.CampProgramUpdateInput = {};

    if (updateCampDto.name !== undefined) updateData.name = updateCampDto.name;
    if (updateCampDto.description !== undefined) updateData.description = updateCampDto.description;
    if (updateCampDto.dates !== undefined) updateData.dates = updateCampDto.dates as unknown as Prisma.InputJsonValue;
    if (updateCampDto.capacity !== undefined) updateData.capacity = updateCampDto.capacity;
    if (updateCampDto.ageRangeMin !== undefined) updateData.ageRangeMin = updateCampDto.ageRangeMin;
    if (updateCampDto.ageRangeMax !== undefined) updateData.ageRangeMax = updateCampDto.ageRangeMax;
    if (updateCampDto.price !== undefined) updateData.price = updateCampDto.price;
    if (updateCampDto.status !== undefined) updateData.status = updateCampDto.status;

    const updated = await this.prisma.campProgram.update({
      where: { id },
      data: updateData,
    });

    this.logger.log(`✅ Camp program updated: ${id} - ${updated.name}`);
    return updated;
  }

  async remove(id: string) {
    this.logger.warn(`🗑️ Deleting camp program: ${id}`);
    
    const camp = await this.findOne(id);

    const deleted = await this.prisma.campProgram.delete({
      where: { id },
    });

    this.logger.log(`✅ Camp program deleted: ${id} - ${camp.name}`);
    return deleted;
  }
}
