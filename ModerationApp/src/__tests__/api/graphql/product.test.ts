import supertest from 'supertest';
import * as http from 'http';
import requestHandler from './requestHandler';
import { asTest1 } from '../login';
import { rest } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

let gqlServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;
jest.mock('next/router', () => require('next-router-mock'));

const URL = 'http://localhost:3013/api/v0/product';

const loginURL = 'http://localhost:3011/api/v0/account/login';
const restServer = setupServer(
  // Get flagged listings
  rest.get(URL + '/flagged', async (req, res, ctx) => {
    return res(ctx.json([
      {id: 'p1ID', seller: 'p1Seller', name: 'p1', price: 100, description: 'www.ad.com', reason: 'url'},
      {id: 'p2ID', seller: 'p2Seller', name: 'p2', price: 100, description: '(123)4567890', reason: 'number'},
    ]))
  }),
  // Delete product
  rest.delete(URL+'/c622f38f-9345-4eec-a754-0906b19a7d12', async (req, res, ctx) => {
    return res(ctx.json("c622f38f-9345-4eec-a754-0906b19a7d12")
    )
  }),
  // Delete product not found
  rest.get(URL+'/c622f38f-9345-4eec-a754-0906b19a7d13', async (req, res, ctx) => {
    res(ctx.status(404, 'Not Found'));
  }),
  // Update product
  rest.post(URL+'/update', async (req, res, ctx) => {
    console.log(req.url.searchParams.get('product_id'));
    return req.url.searchParams.get('product_id') === 'c622f38f-9345-4eec-a754-0906b19a7d12' ?
      res(ctx.json("c622f38f-9345-4eec-a754-0906b19a7d12")) : res(ctx.status(404, 'Not Found'));
  }),
  // Approve product
  rest.post(URL+'/approve', async (req, res, ctx) => {
    console.log(req.url.searchParams.get('product_id'));
    return req.url.searchParams.get('product_id') === 'c622f38f-9345-4eec-a754-0906b19a7d12' ?
      res(ctx.json("c622f38f-9345-4eec-a754-0906b19a7d12")) : res(ctx.status(404, 'Not Found'));
  }),
  // Login
  rest.post(loginURL, async (req, res, ctx) => {
    const user = await req.json()
    return user.email === "user1111@gmail.com" ? res(ctx.json(
      {id: 'userID', name: 'userName', roles: ['moderator', 'member']},
    )) : res(ctx.json(
      {id: 'badID', name: 'badName', roles: []},
    ))
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

let accessToken: string | undefined;
test('Get flagged listings', async () => {
  accessToken = await asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `{getFlaggedProducts {
      id, seller, name, price, description, reason
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      console.log(res.body);
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.getFlaggedProducts[0].id).toBeDefined();
      expect(res.body.data.getFlaggedProducts[0].description).toBeDefined();
      expect(res.body.data.getFlaggedProducts[0].name).toBeDefined();
      expect(res.body.data.getFlaggedProducts[0].price).toBeDefined();
      expect(res.body.data.getFlaggedProducts[0].reason).toBeDefined();
    });
});

test('Delete product', async () => {
  accessToken = await asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{ deleteListing(id: "c622f38f-9345-4eec-a754-0906b19a7d12")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.data.deleteListing).toBeDefined();
    });
});

test('Delete product not found', async () => {
  accessToken = await asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{ deleteListing(id: "c622f38f-9345-4eec-a754-0906b19a7d13")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined();
    });
});

test('Update product', async () => {
  accessToken = await asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{ updateProduct(input: {
      id: "c622f38f-9345-4eec-a754-0906b19a7d12"
      name: "updatedproduct"
      description: "hi"
      })
      }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      console.log(res.body)
      expect(res.body.data.updateProduct).toBeDefined();
    });
});

test('Update product not found', async () => {
  accessToken = await asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{ updateProduct(input: {
      id: "c622f38f-9345-4eec-a754-0906b19a7d13"
      name: "updatedproduct"
      description: "hi"})
      }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined();
    });
});

test('Approve product', async () => {
  accessToken = await asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{ approveProduct(id: "c622f38f-9345-4eec-a754-0906b19a7d12")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.data.approveProduct).toBeDefined();
    });
});

test('Approve product not found', async () => {
  accessToken = await asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{ approveProduct(id: "c622f38f-9345-4eec-a754-0906b19a7d13")}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined();
    });
});

test('Get flagged listings error', async () => {
  accessToken = await asTest1(request);
  restServer.close();
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `{getFlaggedProducts {
      id
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined();
    });
});

test('Update product error', async () => {
  restServer.close();
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{ updateProduct(input: {
      id: "c622f38f-9345-4eec-a754-0906b19a7d13"
      name: "updatedproduct"
      description: "hi"})
      }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined();
    });
});

