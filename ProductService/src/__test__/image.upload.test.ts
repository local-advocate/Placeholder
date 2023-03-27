import supertest from 'supertest';
import * as http from 'http';
import * as db from './db';
import app from '../app';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;
jest.setTimeout(5000)
beforeAll(async () => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  db.shutdown();
  server.close(done);
});

const uploadPath = '/api/v0/image'

test('Image Upload', async () => {
  await request.post(uploadPath)
    .send({data: "sdfdsf", product: "13c16723-cf79-43a5-945c-1bee0cc44b9a", order: 3})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body).toBeDefined();
    });
});