import { ObjectType, Field, ArgsType} from "type-graphql";
import { Matches } from "class-validator";

@ObjectType()
export class Message {
  @Field()
    message!: string
}

@ObjectType()
export class Preview {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    cid!: string 
  @Field()
    name!: string
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type)=> Message)
    message!: Message
}

@ObjectType()
export class PreviewRet {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type)=> [Preview])
    sent!: Preview[]
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type)=> [Preview])
    received!: Preview[]
}

@ObjectType()
export class Conversation {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    conversation_id!: string
}

@ArgsType()
export class ConversationArgs {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    receiver!: string
}

@ArgsType()
export class MessagesArgs {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    conversation_id!: string
}

@ObjectType()
export class Messages {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    id!: string
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    sender!: string
  @Field()
    message!: string
  @Field()
    time!: string
}

@ArgsType()
export class CreateMsgArgs {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    conversation_id!: string
  @Field()
    message!: string
}

@ObjectType()
export class CanMessage {
  @Field()
    bool!: boolean
}
