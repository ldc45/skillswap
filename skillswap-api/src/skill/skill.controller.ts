import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Skill } from './entities/skill.entity';

@ApiTags('skills')
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({
    status: 201,
    description: 'Skill created successfully',
    type: Skill,
  })
  @Post()
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.create(createSkillDto);
  }

  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({
    status: 200,
    description: 'List of skills retrieved successfully',
    type: [Skill],
  })
  @Get()
  findAll() {
    return this.skillService.findAll();
  }

  @ApiOperation({ summary: 'Get a skill by ID' })
  @ApiResponse({
    status: 200,
    description: 'Skill retrieved successfully',
    type: Skill,
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a skill by ID' })
  @ApiResponse({
    status: 200,
    description: 'Skill updated successfully',
    type: Skill,
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillService.update(id, updateSkillDto);
  }

  @ApiOperation({ summary: 'Delete a skill by ID' })
  @ApiResponse({
    status: 200,
    description: 'Skill deleted successfully',
    type: Skill,
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillService.remove(id);
  }
}
