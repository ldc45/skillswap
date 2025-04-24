import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService],
  imports: [PrismaModule],
})
export class ConversationModule {}
