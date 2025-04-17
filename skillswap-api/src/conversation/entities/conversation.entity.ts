import { Conversation as prismaConversation } from '@prisma/client';

export class Conversation implements prismaConversation {
  id: string;
  creatorId: string;
  partnerId: string;
  createdAt: Date;
}
