import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserSkillService } from './user-skill.service';
import { CreateUserSkillDto } from './dto/create-user-skill.dto';
//import { UpdateUserSkillDto } from './dto/update-user-skill.dto';

@Controller('users/:userId/skills')
export class UserSkillController {
  constructor(private readonly userSkillService: UserSkillService) {}

  @Post()
  create(
    @Param('userId') userId: string,
    @Body() createUserSkillDto: CreateUserSkillDto,
  ) {
    return this.userSkillService.addSkillToUser(userId, createUserSkillDto);
  }

  @Get()
  findAll(@Param('userId') userId: string) {
    return this.userSkillService.findAllUserSkills(userId);
  }

  @Delete(':skillId')
  remove(@Param('skillId') skillId: string, @Param('userId') userId: string) {
    return this.userSkillService.removeSkillFromUser(userId, skillId);
  }

  @Get('users-with-skill/:skillId')
  findUsersWithSameSkill(@Param('skillId') skillId: string) {
    return this.userSkillService.findUsersWithSameSkill(skillId);
  }

  /* @Get(':id')
findOne(@Param('id') id: string) {
  return this.userSkillService.findOne(+id);
}

@Patch(':id')
update(
  @Param('id') id: string,
  @Body() updateUserSkillDto: UpdateUserSkillDto,
) {
  return this.userSkillService.update(+id, updateUserSkillDto);
}*/
}
