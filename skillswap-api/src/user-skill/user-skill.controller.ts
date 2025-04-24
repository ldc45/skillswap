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
import { CreateMultipleUserSkillsDto } from './dto/create-multiple-user-skills.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserSkillResponseDto } from './dto/user-skill-response.dto';

@ApiTags('users-skills')
@ApiCookieAuth('access_token')
@UseGuards(AuthGuard)
@Controller('users')
export class UserSkillController {
  constructor(private readonly userSkillService: UserSkillService) {}

  @ApiOperation({ summary: 'Add multiple skills to a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiBody({ type: CreateMultipleUserSkillsDto })
  @ApiResponse({
    status: 201,
    description: 'Skills successfully added to user',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of skills added',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'No new skills were added (user already has all skills)',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User already has all the valid skills',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or none of the provided skills were found',
  })
  @Post(':userId/skills')
  createMultiple(
    @Param('userId') userId: string,
    @Body() createMultipleUserSkillsDto: CreateMultipleUserSkillsDto,
  ): Promise<UserSkillResponseDto[] | { message: string }> {
    return this.userSkillService.addMultipleSkillsToUser(
      userId,
      createMultipleUserSkillsDto,
    );
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
