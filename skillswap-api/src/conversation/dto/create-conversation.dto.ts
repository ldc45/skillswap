import { Message } from '@prisma/client';

export class CreateConversationDto {
  messages: Message[];
  creatorId: string;
  partnerId: string;
}
