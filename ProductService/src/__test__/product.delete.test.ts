import supertest from 'supertest';
import * as http from 'http';
import * as db from './db';
import app from '../app';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const deletePath = '/api/v0/product'
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

test('Delete product', async () => {
  await request.delete(deletePath+'/245f513e-1aae-4357-ae69-a820aa9a55c8')
    .expect(200);
});

test('Delete product not found', async () => {
  await request.delete(deletePath+'/319f9035-c870-411b-8d9a-5e3ad6186123')
    .expect(404);
});
