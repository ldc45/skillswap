import { UserSkill as prismaUserSkill } from '@prisma/client';

export class UserSkill implements prismaUserSkill {
  userId: string;
  skillId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(userSkill: prismaUserSkill) {
    this.userId = userSkill.userId;
    this.skillId = userSkill.skillId;
    this.createdAt = userSkill.createdAt;
    this.updatedAt = userSkill.updatedAt;
  }
}
