import supertest from 'supertest';
import * as http from 'http';
import * as db from './db';
import app from '../app';
import { ProductArgs } from '../product';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const createPath = '/api/v0/product'
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

const product: ProductArgs = {
  price: 100,
  name: "createdItem",
  category: "7f14a85c-4277-4ff7-971f-6b8e4858695c",
  subcategory: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe",
  description: "this is an item",
  attributes: JSON.stringify({condition: "new"}),
}

test('Add product', async () => {
  await request.post(createPath+'?user_id=7f14a85c-4277-4ff7-972e-6b8e4858695c')
    .send(product)
    .expect(201)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.price).toEqual(product.price);
      expect(res.body.name).toEqual(product.name);
      expect(res.body.seller).toEqual('7f14a85c-4277-4ff7-972e-6b8e4858695c');
      expect(res.body.id).toBeDefined();
      expect(res.body.description).toEqual(product.description);
    });
});

test('Add product, Missing fields', async () => {
  await request.post(createPath)
    .send({price: 300})
    .expect(400)
});

const urlproduct: ProductArgs = {
  price: 100,
  name: "createdItem",
  category: "7f14a85c-4277-4ff7-971f-6b8e4858695c",
  subcategory: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe",
  description: "www.ad.com",
  attributes: JSON.stringify({condition: "new"}),
}

test('Add product flagged for URL', async () => {
  await request.post(createPath+'?user_id=7f14a85c-4277-4ff7-972e-6b8e4858695c')
    .send(urlproduct)
    .expect(201)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.price).toEqual(urlproduct.price);
      expect(res.body.name).toEqual(urlproduct.name);
      expect(res.body.seller).toEqual('7f14a85c-4277-4ff7-972e-6b8e4858695c');
      expect(res.body.id).toBeDefined();
      expect(res.body.description).toEqual(urlproduct.description);
    });
});

const numproduct: ProductArgs = {
  price: 100,
  name: "createdItem",
  category: "7f14a85c-4277-4ff7-971f-6b8e4858695c",
  subcategory: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe",
  description: "(123)456-7890",
  attributes: JSON.stringify({condition: "new"}),
}

test('Add product flagged for personal info', async () => {
  await request.post(createPath+'?user_id=7f14a85c-4277-4ff7-972e-6b8e4858695c')
    .send(numproduct)
    .expect(201)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.price).toEqual(numproduct.price);
      expect(res.body.name).toEqual(numproduct.name);
      expect(res.body.seller).toEqual('7f14a85c-4277-4ff7-972e-6b8e4858695c');
      expect(res.body.id).toBeDefined();
      expect(res.body.description).toEqual(numproduct.description);
    });
});