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

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: string) {
    return `This action returns a #${id} category`;
  }

  async findOneByName(name: string) {
    return this.prisma.category.findUnique({
      where: {
        name: name,
      },
    });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: string) {
    return `This action removes a #${id} category`;
  }
}
