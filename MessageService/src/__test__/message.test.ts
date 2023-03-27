import supertest from 'supertest';
import * as http from 'http';
import * as db from './db';
import app from '../app';
import { ConversationArgs, MessageArgs, UUID } from '../message';
import { rest } from 'msw'
import { setupServer } from 'msw/node';

const nameURL = 'http://localhost:3011/api/v0/account/id/:id';
const restServer = setupServer(
  rest.get(nameURL, async (req, res, ctx) => {
    return res(ctx.json({user: {id: 'id', name: 'name'}}))
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

const conversation2: ConversationArgs = {
  sender: '603c3458-c364-49d2-8206-97d16021a1d2',
  receiver: '89f6f241-8425-4001-9268-b427c511185e',
  sender_name: 'name'
}

const message: MessageArgs = {
  message: 'message',
  sender: '89f6f241-8425-4001-9268-b427c511185e'
}

let conv_id: UUID;

test('Add conversation', async () => {
  await request.post(path)
    .send(conversation2)
    .expect(201)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.conversation_id).toBeDefined();
      conv_id = res.body.conversation_id
    });
});

test('Add message', async () => {
  await request.post(path+`/${conv_id}`)
    .send(message)
    .expect(201)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.message).toEqual(message.message);
      expect(res.body.sender).toEqual(message.sender);
      expect(res.body.id).toBeDefined();
      expect(res.body.time).toBeDefined();
    });
});

test('Add message, Conversation 404', async () => {
  await request.post(path+`/${message.sender}`)
    .send(message)
    .expect(404)
});

test('Add message, Missing fields', async () => {
  await request.post(path+`/${conv_id}`)
    .send({time: 'time'})
    .expect(400)
});

test('Get messages', async () => {
  await request.get(path+`/${conv_id}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toEqual(2);
    });
});

test('Get messages, conversation DNE', async () => {
  await request.get(path+`/${message.sender}`)
    .expect(404)
});

test('API Docs', async () => {
  await request.get('/api/v0/docs/')
    .expect(200);
});
