import { Module } from '@nestjs/common';
import { UserSkillService } from './user-skill.service';
import { UserSkillController } from './user-skill.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [UserSkillController],
  providers: [UserSkillService],
  imports: [PrismaModule],
})
export class UserSkillModule {}
