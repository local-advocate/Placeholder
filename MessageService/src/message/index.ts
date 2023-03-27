/**
 * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
 */
export type UUID = string;

export interface ConversationArgs {
  sender: UUID,
  receiver: UUID,
  sender_name: string
}

export interface Conversation {
  conversation_id: UUID,
}

export interface Preview extends Conversation {
  first_message: string,
  receiver_name: string,
}

export interface PreviewRet {
  sent: Preview[],
  received: Preview[],
}

export interface ProductCreateOutput {
    id: UUID,
    price: number,
    name: string,
    description: string,   
    seller: UUID
}

export interface MessageArgs {
  message: string
  sender: UUID,
}

export interface Message extends MessageArgs {
  id: UUID,
  time: string,
}