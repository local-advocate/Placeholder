import supertest from 'supertest';
import * as http from 'http';
import requestHandler from './requestHandler';
import { rest } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

let gqlServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const getuserURL = 'http://localhost:3011/api/v0/account/id/';
const restServer = setupServer(
  rest.get(getuserURL + "4f0605ce-0fea-4a30-9e55-1921336ec11d", async (req, res, ctx) => {
    return  res(ctx.json({user: {id: '4f0605ce-0fea-4a30-9e55-1921336ec11d', name: 'Test User 1'}}))
  }),
  rest.get(getuserURL + "123", async (req, res, ctx) => {
    return  res(ctx.status(404, 'User not found'));
  }),
);

beforeAll(() => {
  gqlServer = http.createServer(requestHandler);
  gqlServer.listen();
  request = supertest(gqlServer);
  restServer.listen()
  return new Promise(resolve => setTimeout(resolve, 500));
});

afterEach(() => restServer.resetHandlers());

afterAll((done) => {
  restServer.close();
  gqlServer.close(done)
});

test('Get user', async () => {
  await request.post('/api/graphql')
    .send({query: `{getUser(id: "4f0605ce-0fea-4a30-9e55-1921336ec11d") {id, name}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.data.getUser.id).toBeDefined();
      expect(res.body.data.getUser.name).toBeDefined();
    });
});

test('Get user not found', async () => {
  await request.post('/api/graphql')
    .send({query: `{getUser(id: "123") {id, name}}`})
    .then((res) => {
      expect(res.body.errors[0]).toBeDefined();
    });
});