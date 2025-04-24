import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const nameCategory = await this.findOneByName(createCategoryDto.name);
    if (nameCategory) {
      throw new BadRequestException(
        'A category with this name already exists.',
      );
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: string) {
    return this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findOneByName(name: string) {
    return this.prisma.category.findUnique({
      where: {
        name: name,
      },
    });
  }

  async getCategorySkills(id: string) {
    return this.prisma.skill.findMany({
      where: {
        categoryId: id,
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: {
        id: id,
      },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    return this.prisma.category.delete({
      where: {
        id: id,
      },
    });
  }
}
