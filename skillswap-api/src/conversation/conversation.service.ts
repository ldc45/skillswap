import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Conversation } from './entities/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  create(createConversationDto: CreateConversationDto) {
    return 'This action adds a new conversation';
  }

  findAll() {
    return this.prisma.conversation.findMany();
  }

  findOne(id: string): Promise<Conversation | null> {
    return this.prisma.conversation.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(
    id: string,
    updateConversationDto: UpdateConversationDto,
  ): Promise<Conversation> {
    const existingConversation = await this.prisma.conversation.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingConversation) {
      throw new Error('Conversation not found');
    }

    // Les seules propriétés qui peuvent être mises à jour sont des metadata
    // comme un titre, statut, etc. si vous en ajoutez plus tard
    return this.prisma.conversation.update({
      where: {
        id: id,
      },
      data: updateConversationDto,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} conversation`;
  }
}
