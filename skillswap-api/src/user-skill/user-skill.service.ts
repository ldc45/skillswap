import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserSkillDto } from './dto/create-user-skill.dto';
import { UpdateUserSkillDto } from './dto/update-user-skill.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserSkillService {
  constructor(private prisma: PrismaService) {
  }

  async addSkillToUser(userId: string, createUserSkillDto: CreateUserSkillDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Vérifier si la compétence existe
    const skill = await this.prisma.skill.findUnique({
      where: { id: createUserSkillDto.skillId },
    });

    if (!skill) {
      throw new NotFoundException(
        `Skill with ID ${createUserSkillDto.skillId} not found`,
      );
    }

    // Vérifier si la relation existe déjà
    const existingUserSkill = await this.prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId: userId,
          skillId: createUserSkillDto.skillId,
        },
      },
    });

    if (existingUserSkill) {
      throw new BadRequestException(
        `User already has the skill with ID ${createUserSkillDto.skillId}`,
      );
    }

    // Créer la relation UserSkill
    return this.prisma.userSkill.create({
      data: {
        userId: userId,
        skillId: createUserSkillDto.skillId,
      },
    });
  }

  async findAllUserSkills(userId: string) {
    // Vérifier si l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // Récupérer toutes les compétences de l'utilisateur avec les informations associées
    const userSkills = await this.prisma.userSkill.findMany({
      where: {
        userId: userId,
      },
      include: {
        skill: {
          include: {
            category: true,
          },
        },
      },
    });

    // Transformer les données pour la réponse
    return userSkills.map((userSkill) => ({
      userId: userSkill.userId,
      skillId: userSkill.skillId,
      skillName: userSkill.skill.name,
      skillDiminutive: userSkill.skill.diminutive,
      categoryId: userSkill.skill.categoryId,
      categoryName: userSkill.skill.category.name,
      categoryColor: userSkill.skill.category.color,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} userSkill`;
  }

  update(id: number, updateUserSkillDto: UpdateUserSkillDto) {
    return `This action updates a #${id} userSkill`;
  }

  async removeSkillFromUser(userId: string, skillId: string) {
    // Vérifier si la relation existe
    const userSkill = await this.prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId: userId,
          skillId: skillId,
        },
      },
    });

    if (!userSkill) {
      throw new NotFoundException(
        `User with ID ${userId} does not have skill with ID ${skillId}`,
      );
    }

    // Supprimer la relation
    return this.prisma.userSkill.delete({
      where: {
        userId_skillId: {
          userId: userId,
          skillId: skillId,
        },
      },
    });
  }
}