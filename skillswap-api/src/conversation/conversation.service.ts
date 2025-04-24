import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Conversation } from './entities/conversation.entity';
import { Request } from 'express';
import { RequestCookies } from '../auth/types/request-cookies';
import { JwtPayload } from '../auth/types/jwt-payload';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    // Extract initial message if provided in the DTO
    const initialMessage =
      createConversationDto.messages &&
      createConversationDto.messages.length > 0
        ? createConversationDto.messages[0]
        : null;
    try {
      // Create conversation with Prisma, connecting the creator and partner users
      return await this.prisma.conversation.create({
        data: {
          creator: {
            connect: { id: createConversationDto.creatorId },
          },
          partner: {
            connect: { id: createConversationDto.partnerId },
          },
          // Conditionally create an initial message if provided
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
          messages: true, // Include all messages in the response
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

  async findAllUserConversation(userId: string): Promise<any[]> {
    try {
      // Fetch all conversations with all messages
      const conversations = await this.prisma.conversation.findMany({
        where: {
          OR: [{ creatorId: userId }, { partnerId: userId }],
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc', // Get all messages in reverse chronological order
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Transform the result to include lastMessage as a separate property
      return conversations.map((conversation) => {
        const messages = [...conversation.messages];
        // The last message is now the first one in the array since we sorted by desc
        const lastMessage =
          messages.length > 0 ? messages[messages.length - 1] : null;

        return {
          ...conversation,
          lastMessage, // Add the lastMessage property
        };
      });
    } catch (error) {
      console.error('Error while fetching user conversations', error);
      throw new InternalServerErrorException(
        'Failed to fetch user conversations',
      );
    }
  }

  async findOne(id: string): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: true, // Include all messages
        creator: true, // Include creator user details
        partner: true, // Include partner user details
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async update(
    id: string,
    updateConversationDto: UpdateConversationDto,
  ): Promise<Conversation> {
    // Validate that messages are provided
    if (
      !updateConversationDto.messages ||
      updateConversationDto.messages.length === 0
    ) {
      throw new BadRequestException('No messages provided');
    }
    const senderId = updateConversationDto.messages[0].senderId;

    // Verify that the conversation exists and the sender is either the creator or partner
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        id,
        OR: [{ creatorId: senderId }, { partnerId: senderId }],
      },
    });

    if (!existingConversation) {
      throw new NotFoundException('Conversation not found');
    }
    try {
      // Add the new messages to the conversation
      return await this.prisma.conversation.update({
        where: { id },
        data: {
          messages: {
            create: updateConversationDto.messages, // Create all new messages
          },
        },
        include: {
          messages: true, // Include all messages in the response
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