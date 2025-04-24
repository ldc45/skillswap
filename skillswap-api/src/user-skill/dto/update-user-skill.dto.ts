import { PartialType } from '@nestjs/swagger';
import { CreateMultipleUserSkillsDto } from './create-multiple-user-skills.dto';

export class UpdateUserSkillDto extends PartialType(
  CreateMultipleUserSkillsDto,
) {}
