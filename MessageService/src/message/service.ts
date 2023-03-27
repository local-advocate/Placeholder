import { Conversation, ConversationArgs, Message, MessageArgs, Preview, PreviewRet, UUID } from "./index"
import {pool} from '../db';

export class MessageService {
  public async getAllConversation(user_id: UUID): Promise<PreviewRet> {
    // Created Conversations
    let select = `
    SELECT (jsonb_build_object('message', m.message) || jsonb_build_object('cid', c.conversation_id) || jsonb_build_object('name', conversation->>'receiver_name')) preview 
    FROM conversation c,
    (SELECT DISTINCT ON (conversation_id) message_id, conversation_id as cid, (message::jsonb - 'sender' - 'id') message FROM message ORDER BY cid, message->>'time' DESC) m
    WHERE c.sender = $1 AND m.cid = c.conversation_id
    `
    let query = {
      text: select,
      values: [`${user_id}`]
    };
    let {rows} = await pool.query(query);
    const sent: Preview[] = [];
    for (const row of rows) {
      sent.push(row.preview);
    }

    // Received Conversations
    select = `
    SELECT (jsonb_build_object('message', m.message) || jsonb_build_object('cid', c.conversation_id) || jsonb_build_object('name', conversation->>'sender_name')) preview 
    FROM conversation c,
    (SELECT DISTINCT ON (conversation_id) message_id, conversation_id as cid, (message::jsonb - 'sender' - 'id') message FROM message ORDER BY cid, message->>'time' DESC) m
    WHERE c.receiver = $1 AND m.cid = c.conversation_id
    `
    query = {
      text: select,
      values: [`${user_id}`]
    };
    ({rows} = await pool.query(query));
    const received: Preview[] = [];
    for (const row of rows) {
      received.push(row.preview);
    }
    return {sent: sent, received: received}
  }

  public async getConversation(from: UUID, to:UUID): Promise<Conversation|undefined> {
    const select = `SELECT conversation_id FROM conversation WHERE (sender, receiver) in (($1, $2), ($2, $1))`;
    const query = {
      text: select,
      values: [`${from}`, `${to}`]
    };
    const {rows} = await pool.query(query);
    return rows.length ===0 ? undefined : {conversation_id: rows[0].conversation_id}
  }

  public async createConversation(conversation: ConversationArgs): Promise<Conversation> {
    const receiver_name: string = await new Promise((resolve, reject) => {
      fetch(`http://localhost:3011/api/v0/account/id/${conversation.receiver}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json',},
      })
        .then((res) => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then((user) => {resolve(user.user.name)})
        .catch(() => {reject(new Error("Error getting user name"))})
    });

    // Create Conversation (no need to check sender)
    let insert = 'INSERT INTO conversation(sender, receiver, conversation) VALUES ($1, $2, $3) RETURNING conversation_id';
    let query = {
      text: insert,
      values: [`${conversation.sender}`,`${conversation.receiver}`, JSON.stringify({receiver_name: receiver_name, sender_name: conversation.sender_name})]
    };
    const {rows} = await pool.query(query);
    const cid: UUID = rows[0].conversation_id;

    // Create Initial Message 
    insert = 'INSERT INTO message(sender, conversation_id, message) VALUES ($1, $2, $3)';
    query = {
      text: insert,
      values: [`${conversation.sender}`,`${cid}`, JSON.stringify({time: new Date().toISOString(), message: `${conversation.sender_name} started a conversation.`})]
    };
    await pool.query(query);

    return {conversation_id: cid};
  }

  public async getMessages(id: UUID) : Promise<Message[]> {
    // Create Message (no need to check sender)
    const insert = `SELECT (jsonb_build_object('id', message_id) || jsonb_build_object('sender', sender) || message::jsonb) message FROM message WHERE conversation_id = $1`;
    const query = {
      text: insert,
      values: [`${id}`]
    };
    const {rows} = await pool.query(query);
    const messages : Message[] = [];
    for (const row of rows) {
      messages.push(row.message);
    }
    return messages;
  }

  public async createMessage(conversation_id: UUID, message: MessageArgs): Promise<Message|undefined> {
    const ret: Message = {
      id: 'none',
      message: message.message,
      time: new Date().toISOString(),
      //time: new Date().toLocaleString('en-US', { weekday:'long', month:'numeric', day:'numeric', hour:'numeric', minute:'numeric'}),
      sender: message.sender
    };

    // Create Message (no need to check sender)
    const insert = 'INSERT INTO message(sender, conversation_id, message) VALUES ($1, $2, $3) RETURNING message_id';
    const query = {
      text: insert,
      values: [`${message.sender}`,`${conversation_id}`, JSON.stringify(ret)]
    };
    try {
      const {rows} = await pool.query(query);
      ret.id = rows[0].message_id;
      return ret;
    } catch {
      return undefined
    }
    
  }
}
