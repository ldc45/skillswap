import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMultipleUserSkillsDto } from './dto/create-multiple-user-skills.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserSkill } from './entities/user-skill.entity';

@Injectable()
export class UserSkillService {
  constructor(private prisma: PrismaService) {}

  async addMultipleSkillsToUser(
    userId: string,
    createMultipleUserSkillsDto: CreateMultipleUserSkillsDto,
  ) {
    // Check if a user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if any skills exist for the provided IDs
    const skills = await this.prisma.skill.findMany({
      where: {
        id: { in: createMultipleUserSkillsDto.skillIds },
      },
    });

    // Extract valid skill IDs that were found in the database
    const validSkillIds = skills.map((skill) => skill.id);

    if (validSkillIds.length === 0) {
      throw new NotFoundException('None of the provided skills were found');
    }

    // Find existing relationships to avoid duplicates
    const existingUserSkills = await this.prisma.userSkill.findMany({
      where: {
        userId,
        skillId: { in: validSkillIds },
      },
    });

    // Extract IDs of skills that user already has
    const existingSkillIds = existingUserSkills.map(
      (userSkill) => userSkill.skillId,
    );

    // Filter out skills that user already has to get list of new skills to add
    const newSkillIds = validSkillIds.filter(
      (skillId) => !existingSkillIds.includes(skillId),
    );

    // If all skills already exist, return with appropriate message
    if (newSkillIds.length === 0) {
      return {
        message: 'User already has all the valid skills',
      };
    }

    // Create new UserSkill relationships in a single operation
    const createdUserSkills = await this.prisma.userSkill.createManyAndReturn({
      data: newSkillIds.map((skillId) => ({
        userId,
        skillId,
      })),
      skipDuplicates: true, // Avoid duplicate key errors
    });

    // Return a meaningful response
    return createdUserSkills;
  }

  // TODO: To be removed if not used
  async findAllUserSkills(userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // Get all user skills with associated information
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

    // Transform data for response
    return userSkills;
  }

  // TODO: To be removed if not used
  async findUsersWithSameSkill(skillId: string): Promise<UserSkill[]> {
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with not found`);
    }

    const userSkills = await this.prisma.userSkill.findMany({
      where: {
        skillId: skillId,
      },
      include: {
        user: true,
      },
    });

    return userSkills;
  }

  async removeSkillFromUser(userId: string, skillId: string) {
    // Check if relationship exists
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

    // Delete the relationship
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
