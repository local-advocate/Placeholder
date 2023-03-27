import supertest from 'supertest';
import * as http from 'http';
import requestHandler from './requestHandler';
import { rest } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

let gqlServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const imageURL = 'http://localhost:3013/api/v0/image';
const restServer = setupServer(
  // Upload image
  rest.post(imageURL, async (req, res, ctx) => {
    await req.json()
    return res(ctx.json('ImageID'))
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

test('Image Upload', async () => {
  await request.post('/api/graphql')
    .send({query: `mutation{uploadImage(data: "sdfdsf", product: "1074d9b1-bc10-4c84-8288-67940ac1a09f", order: 3)}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.uploadImage).toBeDefined();
    });
});

test('Image Upload Fail', async () => {
  restServer.close()
  await request.post('/api/graphql')
    .send({query: `mutation{uploadImage(data: "sdfdsf", product: "1074d9b1-bc10-4c84-8288-67940ac1a09f", order: 3)}`})
    .expect('Content-Type', /json/)
    .then((res) => {
      console.log(res);
      expect(res.body.errors).toBeDefined();
    });
});