import { Test, TestingModule } from '@nestjs/testing';
import { UserSkillService } from './user-skill.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateMultipleUserSkillsDto } from './dto/create-multiple-user-skills.dto';

describe('UserSkillService', () => {
  let service: UserSkillService;

  // Mock of PrismaService to isolate tests from database
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    skill: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    userSkill: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      createManyAndReturn: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSkillService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserSkillService>(UserSkillService);

    // Reset mocks before each test to ensure clean state
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addMultipleSkillsToUser', () => {
    // Test data setup
    const userId = 'user-id-123';
    const createDto: CreateMultipleUserSkillsDto = {
      skillIds: ['skill1', 'skill2', 'skill3'],
    };

    it('should throw NotFoundException if user does not exist', async () => {
      // Arrange: Configure mock to return null user
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert: Verify the correct exception is thrown
      await expect(
        service.addMultipleSkillsToUser(userId, createDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException if no skills are found', async () => {
      // Arrange: User exists but no skills match the provided IDs
      mockPrismaService.user.findUnique.mockResolvedValue({ id: userId });
      mockPrismaService.skill.findMany.mockResolvedValue([]);

      // Act & Assert: Verify the correct exception is thrown
      await expect(
        service.addMultipleSkillsToUser(userId, createDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.skill.findMany).toHaveBeenCalledWith({
        where: { id: { in: createDto.skillIds } },
      });
    });

    it('should return a message if all skills already exist for the user', async () => {
      // Arrange: User and skills exist, and all skills are already associated with the user
      mockPrismaService.user.findUnique.mockResolvedValue({ id: userId });
      const foundSkills = [
        { id: 'skill1' },
        { id: 'skill2' },
        { id: 'skill3' },
      ];
      mockPrismaService.skill.findMany.mockResolvedValue(foundSkills);
      mockPrismaService.userSkill.findMany.mockResolvedValue([
        { userId, skillId: 'skill1' },
        { userId, skillId: 'skill2' },
        { userId, skillId: 'skill3' },
      ]);

      // Act: Call the method under test
      const result = await service.addMultipleSkillsToUser(userId, createDto);

      // Assert: Verify expected result and that no create operation was performed
      expect(result).toEqual({
        message: 'User already has all the valid skills',
      });
      expect(
        mockPrismaService.userSkill.createManyAndReturn,
      ).not.toHaveBeenCalled();
    });

    it('should successfully add new skills to the user', async () => {
      // Arrange: User and skills exist, but user only has one of the skills
      mockPrismaService.user.findUnique.mockResolvedValue({ id: userId });
      const foundSkills = [
        { id: 'skill1' },
        { id: 'skill2' },
        { id: 'skill3' },
      ];
      mockPrismaService.skill.findMany.mockResolvedValue(foundSkills);
      // User already has skill1, but not skill2 and skill3
      mockPrismaService.userSkill.findMany.mockResolvedValue([
        { userId, skillId: 'skill1' },
      ]);
      const createdUserSkills = [
        { userId, skillId: 'skill2' },
        { userId, skillId: 'skill3' },
      ];
      mockPrismaService.userSkill.createManyAndReturn.mockResolvedValue(
        createdUserSkills,
      );

      // Act: Call the method under test
      const result = await service.addMultipleSkillsToUser(userId, createDto);

      // Assert: Verify the correct skills were added and return value is as expected
      expect(result).toEqual(createdUserSkills);
      expect(
        mockPrismaService.userSkill.createManyAndReturn,
      ).toHaveBeenCalledWith({
        data: [
          { userId, skillId: 'skill2' },
          { userId, skillId: 'skill3' },
        ],
        skipDuplicates: true,
      });
    });
  });

  describe('findAllUserSkills', () => {
    // Test data setup
    const userId = 'user-id-123';

    it('should throw NotFoundException if user does not exist', async () => {
      // Arrange: Configure mock to return null user
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert: Verify the correct exception is thrown
      await expect(service.findAllUserSkills(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should return all skills for a user', async () => {
      // Arrange: User exists with multiple skills
      mockPrismaService.user.findUnique.mockResolvedValue({ id: userId });
      const mockUserSkills = [
        {
          userId,
          skillId: 'skill1',
          skill: {
            id: 'skill1',
            name: 'JavaScript',
            category: { name: 'Programming' },
          },
        },
        {
          userId,
          skillId: 'skill2',
          skill: {
            id: 'skill2',
            name: 'React',
            category: { name: 'Programming' },
          },
        },
      ];
      mockPrismaService.userSkill.findMany.mockResolvedValue(mockUserSkills);

      // Act: Call the method under test
      const result = await service.findAllUserSkills(userId);

      // Assert: Verify the returned data and proper query parameters
      expect(result).toEqual(mockUserSkills);
      expect(mockPrismaService.userSkill.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: {
          skill: {
            include: {
              category: true,
            },
          },
        },
      });
    });
  });

  describe('findUsersWithSameSkill', () => {
    // Test data setup
    const skillId = 'skill-id-123';

    it('should throw NotFoundException if skill does not exist', async () => {
      // Arrange: Configure mock to return null skill
      mockPrismaService.skill.findUnique.mockResolvedValue(null);

      // Act & Assert: Verify the correct exception is thrown
      await expect(service.findUsersWithSameSkill(skillId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.skill.findUnique).toHaveBeenCalledWith({
        where: { id: skillId },
      });
    });

    it('should return all users with the same skill', async () => {
      // Arrange: Skill exists and is associated with multiple users
      mockPrismaService.skill.findUnique.mockResolvedValue({ id: skillId });
      const mockUsersWithSkill = [
        {
          userId: 'user1',
          skillId,
          user: { id: 'user1', firstName: 'John', lastName: 'Doe' },
        },
        {
          userId: 'user2',
          skillId,
          user: { id: 'user2', firstName: 'Jane', lastName: 'Smith' },
        },
      ];
      mockPrismaService.userSkill.findMany.mockResolvedValue(
        mockUsersWithSkill,
      );

      // Act: Call the method under test
      const result = await service.findUsersWithSameSkill(skillId);

      // Assert: Verify the returned data and proper query parameters
      expect(result).toEqual(mockUsersWithSkill);
      expect(mockPrismaService.userSkill.findMany).toHaveBeenCalledWith({
        where: { skillId },
        include: {
          user: true,
        },
      });
    });
  });

  describe('removeSkillFromUser', () => {
    // Test data setup
    const userId = 'user-id-123';
    const skillId = 'skill-id-123';

    it('should throw NotFoundException if the user-skill relationship does not exist', async () => {
      // Arrange: Configure mock to return null for the user-skill relationship
      mockPrismaService.userSkill.findUnique.mockResolvedValue(null);

      // Act & Assert: Verify the correct exception is thrown
      await expect(
        service.removeSkillFromUser(userId, skillId),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.userSkill.findUnique).toHaveBeenCalledWith({
        where: {
          userId_skillId: {
            userId,
            skillId,
          },
        },
      });
    });

    it('should successfully remove a skill from a user', async () => {
      // Arrange: User-skill relationship exists
      mockPrismaService.userSkill.findUnique.mockResolvedValue({
        userId,
        skillId,
      });
      const deletedUserSkill = { userId, skillId };
      mockPrismaService.userSkill.delete.mockResolvedValue(deletedUserSkill);

      // Act: Call the method under test
      const result = await service.removeSkillFromUser(userId, skillId);

      // Assert: Verify the correct data is returned and proper deletion parameters
      expect(result).toEqual(deletedUserSkill);
      expect(mockPrismaService.userSkill.delete).toHaveBeenCalledWith({
        where: {
          userId_skillId: {
            userId,
            skillId,
          },
        },
      });
    });
  });
});
