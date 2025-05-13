import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Category } from './entities/category.entity';
import { Skill } from 'src/skill/entities/skill.entity';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const nameCategory = await this.findOneByName(createCategoryDto.name);
    if (nameCategory) {
      throw new BadRequestException(
        'A category with this name already exists.',
      );
    }

    // Delete categories cache to force re-fetch
    await this.cacheManager.del('categories');

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    // Get categories from cache
    const cacheCategories: Category[] | null =
      await this.cacheManager.get('categories');

    if (cacheCategories) {
      // If there is cache, return it
      return cacheCategories;
    } else {
      // Otherwise, fetch from Prisma, set cache and return data
      const categories: Category[] = await this.prisma.category.findMany();
      await this.cacheManager.set('categories', categories, 60 * 60 * 1000);
      return categories;
    }
  }

  async findOne(id: string) {
    // Get cached categories
    const cacheCategories: Category[] | null =
      await this.cacheManager.get('categories');

    // If there are categories in cache & the demanded category is in as well, filter and return it.
    if (cacheCategories) {
      const category = cacheCategories.filter((category: Category) => {
        return category.id === id;
      })[0];

      if (category) {
        return category;
      }
    }

    // If categories haven't been cached, or if the demanded category isn't in the cache for some reason, fetch from Prisma
    return this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
  }

  // No caching for this method since it isn't used by CategoryController
  async findOneByName(name: string) {
    return this.prisma.category.findUnique({
      where: {
        name: name,
      },
    });
  }

  async getCategorySkills(id: string) {
    // Get cached skills
    const cachedSkills: Skill[] | null = await this.cacheManager.get('skills');

    // If there are skills in cache, filter the ones associated to the category id and return them
    if (cachedSkills) {
      return cachedSkills.filter((skill: Skill) => {
        return skill.categoryId === id;
      });
    }

    // Otherwise, fetch from Prisma
    return this.prisma.skill.findMany({
      where: {
        categoryId: id,
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // Delete categories cache to force re-fetch
    await this.cacheManager.del('categories');

    return this.prisma.category.update({
      where: {
        id: id,
      },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    // Delete categories cache to force re-fetch
    await this.cacheManager.del('categories');

    return this.prisma.category.delete({
      where: {
        id: id,
      },
    });
  }
}
