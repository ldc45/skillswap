import { ApiProperty } from '@nestjs/swagger';
import { Conversation as prismaConversation } from '@prisma/client';

export class Conversation implements prismaConversation {
  @ApiProperty({
    description: 'Unique identifier of the conversation',
    example: '12345678-1234-1234-1234-123456789012',
  })
  id: string;

  @ApiProperty({
    description: 'Identifier of the creator of the conversation',
    example: '87654321-4321-4321-4321-210987654321',
  })
  creatorId: string;

  @ApiProperty({
    description: 'Identifier of the partner in the conversation',
    example: '11223344-5566-7788-99aa-bbccddeeff00',
  })
  partnerId: string;

  @ApiProperty({
    description: 'Creation date of the conversation',
    type: 'string',
    format: 'date-time',
    example: '2025-04-17T12:00:00Z',
  })
  createdAt: Date;

  constructor(conversation: prismaConversation) {
    this.id = conversation.id;
    this.creatorId = conversation.creatorId;
    this.partnerId = conversation.partnerId;
    this.createdAt = conversation.createdAt;
  }
}
