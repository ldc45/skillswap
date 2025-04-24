import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { SkillModule } from './skill/skill.module';
import { CategoryModule } from './category/category.module';
import { ConversationModule } from './conversation/conversation.module';
import { AvailabilityModule } from './availability/availability.module';
import { UserSkillModule } from './user-skill/user-skill.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    SkillModule,
    CategoryModule,
    ConversationModule,
    AvailabilityModule,
    UserSkillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
