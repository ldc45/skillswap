import { Message } from '../../message/entities/message.entity';

export class CreateConversationDto {
  messages?: Message[];
  creatorId: string;
  partnerId: string;
}
