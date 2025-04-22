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
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Conversation } from './entities/conversation.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';
import { JwtPayload } from '../auth/types/jwt-payload';

@ApiTags('conversations')
@ApiCookieAuth('access_token')
@UseGuards(AuthGuard)
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @Post()
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The conversation has been successfully created',
    type: Conversation,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.create(createConversationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all conversations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of conversations successfully retrieved',
    type: [Conversation],
  })
  findAll() {
    return this.conversationService.findAll();
  }

  @Get('user/me')
  @ApiOperation({ summary: 'Get all conversations for the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of user conversations successfully retrieved',
    type: [Conversation],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated',
  })
  findMyConversations(@Req() request: Request & { user: JwtPayload }) {
    return this.conversationService.findAllUserConversation(request.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a conversation by its ID' })
  @ApiParam({ name: 'id', description: 'ID of the conversation to retrieve' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation successfully retrieved',
    type: Conversation,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Conversation not found',
  })
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing conversation' })
  @ApiParam({ name: 'id', description: 'ID of the conversation to update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation successfully updated',
    type: Conversation,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Conversation not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationService.update(id, updateConversationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a conversation' })
  @ApiParam({ name: 'id', description: 'ID of the conversation to delete' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation successfully deleted',
    type: Conversation,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Conversation not found',
  })
  remove(@Param('id') id: string) {
    return this.conversationService.remove(id);
  }
}
