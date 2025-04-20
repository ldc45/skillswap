import { CreateMessageDto as Message } from '../../message/dto/create-message.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConversationDto {
  @ApiProperty({
    description: 'List of messages associated with the conversation',
    type: [Message],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Message)
  messages?: Message[];

  @ApiProperty({
    description: 'Identifier of the creator of the conversation',
    example: '87654321-4321-4321-4321-210987654321',
  })
  @IsNotEmpty()
  @IsUUID()
  creatorId: string;

  @ApiProperty({
    description: 'Identifier of the partner of the conversation',
    example: '11223344-5566-7788-99aa-bbccddeeff00',
  })
  @IsNotEmpty()
  @IsUUID()
  partnerId: string;
}
