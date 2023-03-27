import { Conversation, Messages, PreviewRet } from "./schema";

export class MessageService {
  public async getAllConvo(id: string): Promise<PreviewRet> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3014/api/v0/conversation?user_id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((conversations) => {
          resolve(conversations as PreviewRet)
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error Getting Conversations"));
        });
    });
  }

  public async getConvo(sender: string, receiver:string): Promise<Conversation> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3014/api/v0/conversation/check?from=${sender}&to=${receiver}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((conversation) => {
          resolve(conversation as Conversation)
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error Getting Conversations"));
        });
    });
  }

  public async createConvo(sender: string, sender_name: string, receiver: string): Promise<Conversation> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3014/api/v0/conversation/`, {
        method: 'POST',
        body: JSON.stringify({sender: sender, sender_name: sender_name, receiver: receiver}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((conversation) => {
          resolve(conversation as Conversation)
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error Creating Conversation"));
        });
    });
  }

  public async getAllMessages(id: string): Promise<Messages[]> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3014/api/v0/conversation/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((messages) => {
          resolve(messages as Messages[])
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error Getting Messages"));
        });
    });
  }

  public async createMessage(id: string, user_id: string, message: string): Promise<Messages> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3014/api/v0/conversation/${id}`, {
        method: 'POST',
        body: JSON.stringify({message: message, sender: user_id}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((message) => {
          resolve(message as Messages)
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error Creating Message"));
        });
    });
  }
}