import { Injectable } from '@nestjs/common';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async create(createAvailabilityDto: CreateAvailabilityDto[]) {
    const newAvailabilities = createAvailabilityDto.map((availability) => ({
      ...availability,
      startTime: new Date(availability.startTime),
      endTime: new Date(availability.endTime),
    }));
    return this.prisma.availability.createManyAndReturn({
      data: newAvailabilities,
    });
  }

  async findAll() {
    return this.prisma.availability.findMany();
  }

  async findOne(id: string) {
    return this.prisma.availability.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateAvailabilityDto: UpdateAvailabilityDto) {
    return this.prisma.availability.update({
      where: {
        id,
      },
      data: updateAvailabilityDto,
    });
  }

  async remove(id: string) {
    return this.prisma.availability.delete({
      where: {
        id,
      },
    });
  }
}
