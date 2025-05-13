import { Inject, Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createSkillDto: CreateSkillDto) {
    // Delete skills cache to force re-fetch
    await this.cacheManager.del('skills');

    return this.prisma.skill.create({
      data: createSkillDto,
    });
  }

  async findAll() {
    // Get skills from cache
    const cacheSkills: Skill[] | null = await this.cacheManager.get('skills');

    if (cacheSkills) {
      // If there is cache, return it
      return cacheSkills;
    } else {
      // Otherwise, fetch from Prisma, set cache and return data
      const skills: Skill[] = await this.prisma.skill.findMany();
      await this.cacheManager.set('skills', skills, 60 * 60 * 1000);
      return skills;
    }
  }

  async findOne(id: string) {
    // Get cached skills
    const cacheSkills: Skill[] | null = await this.cacheManager.get('skills');

    // If there is cache & demanded skill is in it, filter and return it.
    if (cacheSkills) {
      const skill = cacheSkills.filter((skill: Skill) => {
        return skill.id === id;
      })[0];

      if (skill) {
        return skill;
      }
    }

    // If there is no cache, or if the demanded skill isn't in it for some reason, fetch from Prisma.
    return this.prisma.skill.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    // Delete skills cache to force re-fetch
    await this.cacheManager.del('skills');

    return this.prisma.skill.update({
      where: {
        id,
      },
      data: updateSkillDto,
    });
  }

  async remove(id: string) {
    // Delete skills cache to force re-fetch
    await this.cacheManager.del('skills');

    return this.prisma.skill.delete({
      where: {
        id,
      },
    });
  }
}
