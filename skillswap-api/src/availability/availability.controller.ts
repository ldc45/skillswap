import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Availability } from './entities/availability.entity';

@ApiTags('availabilities')
@Controller('availabilities')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @ApiOperation({
    summary: 'Create a new availability for a user',
  })
  @ApiResponse({
    status: 201,
    description: 'Availability created successfully',
    type: Availability,
  })
  @Post()
  create(@Body() createAvailabilityDto: CreateAvailabilityDto) {
    return this.availabilityService.create(createAvailabilityDto);
  }

  @ApiOperation({
    summary: 'Get all availabilities',
  })
  @ApiResponse({
    status: 200,
    description: 'List of availabilities retrieved successfully',
    type: [Availability],
  })
  @Get()
  findAll() {
    return this.availabilityService.findAll();
  }

  @ApiOperation({
    summary: 'Get an availability by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Availability retrieved successfully',
    type: Availability,
  })
  @ApiResponse({
    status: 404,
    description: 'Availability not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.availabilityService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update an availability by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Availability updated successfully',
    type: Availability,
  })
  @ApiResponse({
    status: 404,
    description: 'Availability not found',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.update(id, updateAvailabilityDto);
  }

  @ApiOperation({
    summary: 'Delete an availability by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Availability deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Availability not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availabilityService.remove(id);
  }
}
