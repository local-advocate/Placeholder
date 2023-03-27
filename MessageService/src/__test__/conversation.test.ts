import supertest from 'supertest';
import * as http from 'http';
import * as db from './db';
import app from '../app';
import { ConversationArgs } from '../message';
import { rest } from 'msw'
import { setupServer } from 'msw/node';

const nameURL = 'http://localhost:3011/api/v0/account/id/:id';
const restServer = setupServer(
  rest.get(nameURL, async (req, res, ctx) => {
    return req.params.id === '603c1158-c364-49d2-8206-97d16021a1d2' ?
      res(ctx.status(404))
      : res(ctx.json({user: {id: 'id', name: 'name'}}))
  }),
);

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const path = '/api/v0/conversation'

beforeAll(async () => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  restServer.listen({onUnhandledRequest: 'bypass'})
  return db.reset();
});

afterEach(() => restServer.resetHandlers());

afterAll((done) => {
  db.shutdown();
  server.close(done);
  restServer.close()
});

const conversation: ConversationArgs = {
  sender: '89f6f241-8425-4001-9268-b427c511185e',
  receiver: '7f14a85c-4277-4ff7-971f-6b8e4858695c',
  sender_name: 'name'
}

const conversation2: ConversationArgs = {
  sender: '603c3458-c364-49d2-8206-97d16021a1d2',
  receiver: '89f6f241-8425-4001-9268-b427c511185e',
  sender_name: 'name'
}

const conversation3: ConversationArgs = {
  sender: '603c3458-c364-49d2-8206-97d16021a1d2',
  receiver: '603c1158-c364-49d2-8206-97d16021a1d2',
  sender_name: 'name'
}

let cid: string;

test('Add conversation', async () => {
  await request.post(path)
    .send(conversation)
    .expect(201)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.conversation_id).toBeDefined();
      cid = res.body.conversation_id
    });
  await request.post(path)
    .send(conversation2)
    .expect(201)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.conversation_id).toBeDefined();
    });
});

test('Add conversation, Missing fields', async () => {
  await request.post(path)
    .send({sender_name: 'name'})
    .expect(400)
});

test('Get conversations', async () => {
  await request.get(path+`?user_id=${conversation.sender}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.sent).toBeDefined();
      expect(res.body.received).toBeDefined();
      expect(res.body.sent.length).toEqual(1);
      expect(res.body.received.length).toEqual(1);
    });
});

test('Get conversation', async () => {
  await request.get(path+`/check?from=${conversation.sender}&to=${conversation.receiver}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.conversation_id).toEqual(cid);
    });
});

test('Get conversation DNE', async () => {
  await request.get(path+`/check?from=${conversation.receiver}&to=${conversation.receiver}`)
    .expect(404)
});

test('Name fetch fail', async () => {
  await request.post(path)
    .send(conversation3)
    .expect(500)
});