import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { UserSkillService } from './user-skill.service';
import { CreateUserSkillDto } from './dto/create-user-skill.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('users-skills')
@ApiCookieAuth('access_token')
@UseGuards(AuthGuard)
@Controller('users')
export class UserSkillController {
  constructor(private readonly userSkillService: UserSkillService) {}

  @ApiOperation({ summary: 'Add a skill to a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiBody({ type: CreateUserSkillDto })
  @ApiResponse({ status: 201, description: 'Skill successfully added to user' })
  @ApiResponse({ status: 404, description: 'User or skill not found' })
  @ApiResponse({ status: 400, description: 'User already has this skill' })
  @Post(':userId/skills')
  create(
    @Param('userId') userId: string,
    @Body() createUserSkillDto: CreateUserSkillDto,
  ) {
    return this.userSkillService.addSkillToUser(userId, createUserSkillDto);
  }
  // TODO: To be removed if not used
  @ApiOperation({ summary: 'Get all skills of a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of user skills' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':userId/skills')
  findAll(@Param('userId') userId: string) {
    return this.userSkillService.findAllUserSkills(userId);
  }

  @ApiOperation({ summary: 'Remove a skill from a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'skillId', description: 'Skill ID' })
  @ApiResponse({
    status: 200,
    description: 'Skill successfully removed from user',
  })
  @ApiResponse({
    status: 404,
    description: 'User skill relationship not found',
  })
  @Delete(':userId/skills/:skillId')
  remove(@Param('skillId') skillId: string, @Param('userId') userId: string) {
    return this.userSkillService.removeSkillFromUser(userId, skillId);
  }
  // TODO: To be removed if not used
  @ApiOperation({ summary: 'Find all users with a specific skill' })
  @ApiParam({ name: 'skillId', description: 'Skill ID' })
  @ApiResponse({
    status: 200,
    description: 'List of users with the specified skill',
  })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  @Get('/skills/:skillId')
  findUsersWithSameSkill(@Param('skillId') skillId: string) {
    return this.userSkillService.findUsersWithSameSkill(skillId);
  }
}
