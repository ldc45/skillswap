import { Message as prismaMessage } from '@prisma/client';

export class Message implements prismaMessage {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;
  conversationId: string;
}
