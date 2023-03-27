import supertest from 'supertest';
import * as http from 'http';
import requestHandler from './requestHandler';
import { asTest1 } from '../login';
import { rest } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

let gqlServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;
jest.mock('next/router', () => require('next-router-mock'));

const badUUID = '7f14a85c-4277-4ff7-971f-6b8e4858614c';

const URL = 'http://localhost:3014/api/v0/conversation';
const loginURL = 'http://localhost:3011/api/v0/account/login';
const restServer = setupServer(
  // Get All Conversations
  rest.get(URL, async (req, res, ctx) => {
    console.log(req.headers)
    return res(ctx.json({
      sent: [
        {cid: "cc63ab2c-ba12-44d1-8db1-9cd159c5a4fc", name: "Name1", message:{message:"M1"}},
        {cid: "cc63ab1c-ba12-44d1-8db1-9cd159c5a4fc", name: "Name2", message:{message:"M2"}},
      ],
      received: [
        {cid: "cc63ab3c-ba12-44d1-8db1-9cd159c5a4fc", name: "Name3", message:{message:"M3"}},
        {cid: "cc63ab4c-ba12-44d1-8db1-9cd159c5a4fc", name: "Name4", message:{message:"M4"}},
      ]
    }
    ))
  }),
  // Get Conversation
  rest.get(URL+'/check', async (req, res, ctx) => {
    const from = req.url.searchParams.get('from')
    return from === badUUID ? res(ctx.status(500)) : res(ctx.json({conversation_id:'cc63ab4c-ba12-44d1-8db1-9cd159c5a4fc'}))
  }),
  // Create Conversation
  rest.post(URL, async (req, res, ctx) => {
    const data = await req.json()
    return data.receiver === badUUID ? res(ctx.status(500)) :
      res(ctx.json(
        {conversation_id: "cid"},
      ))
  }),
  // Get All Messages
  rest.get(URL+'/:id', async (req, res, ctx) => {
    return req.params.id === badUUID ? res(ctx.status(500)) :
      res(ctx.json([
        {id: "none", sender: "sender", time:"time", message:"M1"},
        {id: "none", sender: "receiver", time:"time", message:"M2"},
      ]))
  }),
  // Create Message
  rest.post(URL+'/:id', async (req, res, ctx) => {
    const data = await req.json()
    return req.params.id === badUUID ? res(ctx.status(500)) :
      res(ctx.json(
        {id: "none", sender: "sender", time:"time", message:data.message},
      ))
  }),
  // Login
  rest.post(loginURL, async (req, res, ctx) => {
    await req.json()
    return res(ctx.json(
      {id: 'userID', name: 'userName', roles: ['admin', 'member']}));
  }),
);

beforeAll(() => {
  gqlServer = http.createServer(requestHandler);
  gqlServer.listen();
  request = supertest(gqlServer);
  restServer.listen()
});

afterEach(() => restServer.resetHandlers());

afterAll((done) => {
  restServer.close();
  gqlServer.close(done)
});

let accessToken: string | undefined;
test('All Conversations', async () => {
  accessToken = await asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `query {conversations {
      sent {message{message} name cid}
      received {message{message} name cid}
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.conversations.sent.length).toBeGreaterThan(0);
      expect(res.body.data.conversations.received.length).toBeGreaterThan(0);
      expect(res.body.data.conversations.sent[0].cid).toBeDefined();
      expect(res.body.data.conversations.sent[0].name).toBeDefined();
      expect(res.body.data.conversations.sent[0].message.message).toBeDefined();
      expect(res.body.data.conversations.received[0].cid).toBeDefined();
      expect(res.body.data.conversations.received[0].name).toBeDefined();
      expect(res.body.data.conversations.received[0].message.message).toBeDefined();
    });
});

const UUID = '7f14a85c-4277-4ff7-971f-6b8e4858695c';
test('Get Conversation', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `query {conversation (receiver: "${UUID}") {conversation_id}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.conversation.conversation_id).toBeDefined();
    });
});

test('Get Conversation DNE', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `query {conversation (receiver: "${badUUID}") {conversation_id}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});

test('Create Conversation', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation {createConversation(receiver: "${UUID}") {
      conversation_id
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.createConversation).toBeDefined();
      expect(res.body.data.createConversation.conversation_id).toBeDefined();
    });
});

test('Create Conversation Fail', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation {createConversation(receiver: "${badUUID}") {
      conversation_id
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});

test('Can Message', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `query {canMessage {bool}}`})
    .expect(200)
});

test('All Messages', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `query {messages(conversation_id: "${UUID}") {
      time message id sender
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.messages.length).toBeGreaterThan(0);
      expect(res.body.data.messages[0].time).toBeDefined();
      expect(res.body.data.messages[0].sender).toBeDefined();
      expect(res.body.data.messages[0].message).toBeDefined();
      expect(res.body.data.messages[0].id).toBeDefined();
    });
});

test('All Messages 404', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `query {messages(conversation_id: "${badUUID}") {
      time message id sender
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});

test('Create Message', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation {createMessage(conversation_id: "${UUID}", message: "new") {
      time message id sender
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.createMessage).toBeDefined();
      expect(res.body.data.createMessage.id).toBeDefined();
      expect(res.body.data.createMessage.sender).toBeDefined();
      expect(res.body.data.createMessage.time).toBeDefined();
      expect(res.body.data.createMessage.message).toEqual("new");
    });
});

test('Create Message Fail', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation {createMessage(conversation_id: "${badUUID}", message: "new") {
      time message id sender
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});

test('All Conversations Fetch Fail', async () => {
  restServer.close();
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `query {conversations {
      sent {message{message} name cid}
      received {message{message} name cid}
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined();
    });
  
});