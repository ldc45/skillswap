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
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Availability } from './entities/availability.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AvailabilityResponseDto } from './dto/availability-response.dto';

@ApiTags('availabilities')
@Controller('availabilities')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @ApiOperation({
    summary: 'Create new availabilities for a user',
  })
  @ApiCookieAuth('access_token')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Availability created successfully',
    type: [AvailabilityResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createAvailabilityDto: CreateAvailabilityDto[],
  ): Promise<AvailabilityResponseDto[]> {
    return this.availabilityService.create(createAvailabilityDto);
  }

  @ApiOperation({
    summary: 'Get all availabilities',
  })
  @ApiResponse({
    status: HttpStatus.OK,
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
    status: HttpStatus.OK,
    description: 'Availability retrieved successfully',
    type: Availability,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Availability not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.availabilityService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update an availability by ID',
  })
  @ApiCookieAuth('access_token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Availability updated successfully',
    type: Availability,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Availability not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
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
  @ApiCookieAuth('access_token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Availability deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Availability not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availabilityService.remove(id);
  }
}
