import { Prisma } from '@prisma/client';

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    skills: {
      select: {
        skill: {
          select: {
            id: true;
            name: true;
            diminutive: true;
            categoryId: true;
          };
        };
      };
    };
    availabilities: {
      select: {
        id: true;
        day: true;
        startTime: true;
        endTime: true;
      };
    };
  };
}>;
