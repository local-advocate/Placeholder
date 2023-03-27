import supertest from 'supertest';
import * as http from 'http';
import * as db from './db';
import app from '../app';
// import { CarFilters } from '../product'

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const filterPath = '/api/v0/product/filtered?filters='
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

test('Get All by Category', async () => {
  await request.post(filterPath+'{"category":"7f14a85c-4277-4ff7-971f-6b8e4858695c"}')
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

test('Get All by SubCategory', async () => {
  await request.post(filterPath+'{"subcategory":"628a2def-7df5-472e-9c45-7cdf6cf5cc64"}')
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

test('Search item', async () => {
  await request.post(filterPath+'{"q": "Miata"}')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].name).toMatch(/Miata/);
    })
})

test('Filter item Price', async () => {
  await request.post(filterPath+'{"q": "Miata", "price_min": "5", "price_max": "100000"}')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].name).toMatch(/Miata/);
    })
})

test('Filter item Condition', async () => {
  await request.post(filterPath+'{"condition": "fair", "max_year":10000,"min_year":1}')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBe(0)
    })
})

const carFilters = {
  condition: 'good',
}

test('Filter Car', async () => {
  await request.post(filterPath+JSON.stringify(carFilters))
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeGreaterThan(0)
    })
})

