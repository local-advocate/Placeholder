import supertest from 'supertest';
import * as http from 'http';
import * as db from './db';
import app from '../app';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const productPath = '/api/v0/product/'
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

test('All Items', async () => {
  await request.get(productPath)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].id).toBeDefined();
      expect(res.body[0].seller).toBeDefined();
      expect(res.body[0].name).toBeDefined();
      expect(res.body[0].price).toBeDefined();
      expect(res.body[0].images).toBeDefined();
      expect(res.body[0].mainImage).toBeDefined();
    });
});

test('One item', async () => {
  await request.get(productPath+'c622f38f-9345-4eec-a754-0906b19a7d12')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.mainImage).toBeDefined();
      expect(res.body.images).toBeDefined();
      expect(res.body.seller).toEqual('b5388565-884a-48cc-bca8-0564d08e9f0a');
      expect(res.body.name).toEqual('Mac');
      expect(res.body.price).toEqual(1000);
    });
});

test('One item Malformed Id', async () => {
  await request.get(productPath+'bad')
    .expect(400)
});

test('One Item error', async () => {
  await request.get(productPath+'a4625a03-6938-4129-92f6-a7ade657202d')
    .expect(404)
});

test('API Docs', async () => {
  await request.get('/api/v0/docs/')
    .expect(200);
});

test('All items of user', async () => {
  await request.get(`/api/v0/product?user_id=b5388565-884a-48cc-bca8-0564d08e9f0a`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
    });
})

test('Get flagged products', async () => {
  await request.get(productPath+'flagged')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].id).toBeDefined();
      expect(res.body[0].seller).toBeDefined();
      expect(res.body[0].name).toBeDefined();
      expect(res.body[0].price).toBeDefined();
      expect(res.body[0].reason).toBeDefined();
      expect(res.body[0].flagged).toBeDefined();
    });
});