import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Conversation } from './entities/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const initialMessage =
      createConversationDto.messages &&
      createConversationDto.messages.length > 0
        ? createConversationDto.messages[0]
        : null;
    try {
      return await this.prisma.conversation.create({
        data: {
          creator: {
            connect: { id: createConversationDto.creatorId },
          },
          partner: {
            connect: { id: createConversationDto.partnerId },
          },
          ...(initialMessage
            ? {
                messages: {
                  create: {
                    content: initialMessage.content,
                    sender: {
                      connect: { id: initialMessage.senderId },
                    },
                  },
                },
              }
            : {}),
        },
        include: {
          messages: true,
          creator: true,
          partner: true,
        },
      });
    } catch (error) {
      console.error('Error while creating the conversation', error);
      throw new InternalServerErrorException(
        'Failed to create the conversation',
      );
    }
  }

  async findAll(): Promise<Conversation[]> {
    return this.prisma.conversation.findMany();
  }

  async findOne(id: string): Promise<Conversation> {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: { id },
        include: {
          messages: true,
          creator: true,
          partner: true,
        },
      });

      if (!conversation) {
        throw new NotFoundException('Conversation not found');
      }

      return conversation;
    } catch (error) {
      console.error('Error while retrieving the conversation', error);
      throw new InternalServerErrorException(
        'Failed to retrieve the conversation',
      );
    }
  }

  async update(
    id: string,
    updateConversationDto: UpdateConversationDto,
  ): Promise<Conversation> {
    try {
      const existingConversation = await this.prisma.conversation.findUnique({
        where: { id },
      });

      if (!existingConversation) {
        throw new NotFoundException('Conversation not found');
      }

      return await this.prisma.conversation.update({
        where: { id },
        data: {
          messages: {
            create: updateConversationDto.messages,
          },
        },
        include: {
          messages: true,
        },
      });
    } catch (error) {
      console.error('Error while updating the conversation', error);
      throw new InternalServerErrorException(
        'Failed to update the conversation',
      );
    }
  }

  async remove(id: string): Promise<Conversation> {
    try {
      return await this.prisma.conversation.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error while deleting the conversation', error);
      throw new InternalServerErrorException(
        'Failed to delete the conversation',
      );
    }
  }
}
