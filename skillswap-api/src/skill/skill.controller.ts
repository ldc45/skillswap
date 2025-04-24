import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Skill } from './entities/skill.entity';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('skills')
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @ApiOperation({ summary: 'Create a new skill' })
  @ApiCookieAuth('access_token')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Skill created successfully',
    type: Skill,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillService.create(createSkillDto);
  }

  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of skills retrieved successfully',
    type: [Skill],
  })
  @Get()
  findAll() {
    return this.skillService.findAll();
  }

  @ApiOperation({ summary: 'Get a skill by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill retrieved successfully',
    type: Skill,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Skill not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a skill by ID' })
  @ApiCookieAuth('access_token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill updated successfully',
    type: Skill,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Skill not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillService.update(id, updateSkillDto);
  }

  @ApiOperation({ summary: 'Delete a skill by ID' })
  @ApiCookieAuth('access_token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Skill deleted successfully',
    type: Skill,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Skill not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillService.remove(id);
  }
}
