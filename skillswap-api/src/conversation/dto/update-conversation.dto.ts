import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateConversationDto } from './create-conversation.dto';

export class UpdateConversationDto extends PartialType(
  OmitType(CreateConversationDto, ['creatorId', 'partnerId'] as const),
) {}
