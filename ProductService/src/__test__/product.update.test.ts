import supertest from 'supertest';
import * as http from 'http';
import * as db from './db';
import app from '../app';
import { ProductArgs, UpdateProductArgs } from '../product';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const productPath = '/api/v0/product'
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

const newproduct: UpdateProductArgs = {
  name: "createdItem",
  description: "updated item",
}

test('Update', async () => {
  let product_id;
  await request.post(productPath+'?user_id=7f14a85c-4277-4ff7-972e-6b8e4858695c')
    .send(product)
    .expect(201)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.price).toEqual(product.price);
      product_id = res.body.id;
    });
  await request.post(productPath+`/update?product_id=${product_id}`)
    .send(newproduct)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

test('Update product not found', async () => {
  await request.post(productPath+`/update?product_id=1f14a85c-4277-4ff7-972e-6b8e4858695c`)
    .send(newproduct)
    .expect(404)
});