import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Response,
  Route,
  SuccessResponse,
} from 'tsoa'

import { Conversation, ConversationArgs, Message, UUID, MessageArgs, PreviewRet } from '.'
import { MessageService } from './service'

@Route('conversation')
export class MessageController extends Controller {
  @Get()
  public async getAll(
    @Query() user_id: UUID,
  ): Promise<PreviewRet> {
    return await new MessageService().getAllConversation(user_id);
  }
  
  @Get('check')
  @Response('404', 'Not Found')
  public async getOne(
    @Query() from: UUID,
    @Query() to: UUID,
  ): Promise<Conversation|undefined> {
    return await new MessageService().getConversation(from, to)
      .then(async (conversation: Conversation|undefined): Promise<Conversation|undefined> => {
        if (!conversation) {
          this.setStatus(404);
        }
        return conversation;
      });
  }

  @Post()
  @SuccessResponse('201', 'Conversation created')
  public async create(
    @Body() conversation: ConversationArgs,
  ): Promise<Conversation> {
    return await new MessageService().createConversation(conversation);
  }

  @Get('{conversation_id}')
  @Response('404', 'Not Found')
  public async getMessages(
    @Path() conversation_id: UUID
  ): Promise<Message[]> {
    return await new MessageService().getMessages(conversation_id)
      .then(async (messages: Message[]): Promise<Message[]> => {
        if (!messages || messages.length === 0) {
          this.setStatus(404);
        }
        return messages;
      });
  }

  @Post('{conversation_id}')
  @SuccessResponse('201', 'Message created')
  public async createMessage(
    @Path() conversation_id: UUID,
    @Body() message: MessageArgs
  ): Promise<Message|undefined> {
    return await new MessageService().createMessage(conversation_id, message)
      .then(async (message: Message|undefined): Promise<Message|undefined> => {
        if (!message) {
          this.setStatus(404);
        }
        return message;
      });
  }
}
