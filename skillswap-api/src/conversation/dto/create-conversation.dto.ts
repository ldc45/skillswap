import { CreateMessageDto as Message } from '../../message/dto/create-message.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({
    description: 'List of messages associated with the conversation',
    type: [Message],
    required: false,
  })
  messages?: Message[];

  @ApiProperty({
    description: 'Identifier of the creator of the conversation',
    example: '87654321-4321-4321-4321-210987654321',
  })
  creatorId: string;

  @ApiProperty({
    description: 'Identifier of the partner of the conversation',
    example: '11223344-5566-7788-99aa-bbccddeeff00',
  })
  partnerId: string;
}
