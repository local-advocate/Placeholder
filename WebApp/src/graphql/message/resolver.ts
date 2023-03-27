import { Resolver, Query, Authorized, Mutation, Args, Ctx } from "type-graphql"
import { MessageService } from "./service";
import { CanMessage, Conversation, ConversationArgs, CreateMsgArgs, Messages, MessagesArgs, PreviewRet } from "./schema";
import type { NextApiRequest } from 'next';

@Resolver()
export class MessageResolver {

  @Authorized("member")
  @Query(()=>CanMessage)
  async canMessage(): Promise<CanMessage> {
    return {bool: true};
  }

  @Authorized("member")
  @Query(() => PreviewRet)
  async conversations(
    @Ctx() request: NextApiRequest
  ): Promise<PreviewRet> {
    return new MessageService().getAllConvo(request.user.id);
  }

  @Authorized("member")
  @Query(() => Conversation)
  async conversation(
    @Ctx() request: NextApiRequest,
    @Args() {receiver}: ConversationArgs
  ): Promise<Conversation> {
    return new MessageService().getConvo(receiver, request.user.id);
  }

  @Authorized("member")
  @Mutation(() => Conversation)
  async createConversation(
    @Args() {receiver}: ConversationArgs,
    @Ctx() request: NextApiRequest
  ): Promise<Conversation> {
    return new MessageService().createConvo(request.user.id, request.user.name, receiver);
  }

  @Authorized("member")
  @Query(() => [Messages])
  async messages(
    @Args() {conversation_id}: MessagesArgs
  ): Promise<Messages[]> {
    return new MessageService().getAllMessages(conversation_id);
  }

  @Authorized("member")
  @Mutation(() => Messages)
  async createMessage(
    @Args() {conversation_id, message}: CreateMsgArgs,
    @Ctx() request: NextApiRequest
  ): Promise<Messages> {
    return new MessageService().createMessage(conversation_id, request.user.id, message);
  }
}
