import supertest from 'supertest';
import * as http from 'http';
import requestHandler from './requestHandler';
import { asTest1, asNobby } from '../login';
import { rest } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

let gqlServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;
jest.mock('next/router', () => require('next-router-mock'));

const URL = 'http://localhost:3013/api/v0/product';
const deleteURL = 'http://localhost:3013/api/v0/product/:id';

const loginURL = 'http://localhost:3011/api/v0/account/login';
const restServer = setupServer(
  // Get All
  rest.get(URL, async (req, res, ctx) => {
    if(req.url.searchParams.get('user_id') === 'badID') {
      console.log('RETURNINGNGNGN EERRRRR ', req.url.searchParams.get('user_id'))
      throw new Error('error')
    }
    return res(ctx.json([
      {id: 'p1ID', seller: 'p1Seller', name: 'p1', price: 100, images: [], mainImage: 'x111'},
      {id: 'p2ID', seller: 'p2Seller', name: 'p2', price: 100, images: [], mainImage: 'x111'},
    ]))
  }),
  // Get All Filtered
  rest.post(URL+'/filtered', async (req, res, ctx) => {
    return res(ctx.json([
      {id: 'p3ID', seller: 'p3Seller', name: 'p3', price: 100, images: [], mainImage: 'x111'},
      {id: 'p4ID', seller: 'p4Seller', name: 'p4', price: 100, images: [], mainImage: 'x111'},
    ]))
  }),
  // Get One
  rest.get(URL+'/:id', async (req, res, ctx) => {
    return req.params.id === "c622f38f-9345-4eec-a754-0906b19a7d12" ? res(ctx.json(
      {id: 'p5ID', seller: 'p5Seller', name: 'p5', price: 100, images: [], mainImage: 'x111'},
    )) : res(ctx.status(404, 'Not Found'));
  }),
  // Create product
  rest.post(URL, async (req, res, ctx) => {
    return res(ctx.json(
      {id: 'p6ID', seller: 'p6Seller', name: 'p6', price: 100, images: [], mainImage: 'x111', description: 'desc', condition: 'new'},
    ))
  }),
  // DELETE
  rest.delete(deleteURL, async (req, res, ctx) => {
    return req.params.id === 'badID' ? res(ctx.status(404)) :
      res(ctx.json('id'))
  }),
  // Login
  rest.post(loginURL, async (req, res, ctx) => {
    const user = await req.json()     
    return user.email === "user1111@gmail.com" ? res(ctx.json(
      {id: 'userID', name: 'userName', roles: ['admin', 'member']},
    )) : res(ctx.json(
      {id: 'badID', name: 'badName', roles: ['member']},
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

test('All Items', async () => {
  await request.post('/api/graphql')
    .send({query: `{products {
      id, seller, name, price, mainImage, images
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      console.log(res.body);
      expect(res.body.data.products.length).toBeGreaterThan(0);
      expect(res.body.data.products[0].id).toBeDefined();
      expect(res.body.data.products[0].seller).toBeDefined();
      expect(res.body.data.products[0].name).toBeDefined();
      expect(res.body.data.products[0].price).toBeDefined();
      expect(res.body.data.products[0].images).toBeDefined();
      expect(res.body.data.products[0].mainImage).toBeDefined();
    });
});

test('Get All Filtered', async () => {
  await request.post('/api/graphql')
    .send({query: `{productsFiltered(filters:"{category:7f14a85c-4277-4ff7-971f-6b8e4858695c}") {
      id, seller, name, price, mainImage, images
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.productsFiltered.length).toBeGreaterThan(0);
      expect(res.body.data.productsFiltered[0].id).toBeDefined();
      expect(res.body.data.productsFiltered[0].seller).toBeDefined();
      expect(res.body.data.productsFiltered[0].name).toBeDefined();
      expect(res.body.data.productsFiltered[0].price).toBeDefined();
      expect(res.body.data.productsFiltered[0].images).toBeDefined();
      expect(res.body.data.productsFiltered[0].mainImage).toBeDefined();
    });
});

test('One item', async () => {
  await request.post('/api/graphql')
    .send({query: `{product(id: "c622f38f-9345-4eec-a754-0906b19a7d12") {
      id, seller, name, price, mainImage, images
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.product).toBeDefined();
      expect(res.body.data.product.mainImage).toBeDefined();
      expect(res.body.data.product.images).toBeDefined();
      expect(res.body.data.product.seller).toEqual('p5Seller');
      expect(res.body.data.product.name).toEqual('p5');
      expect(res.body.data.product.price).toEqual(100);
    });
});

test('One item No Id', async () => {
  await request.post('/api/graphql')
    .send({query: `{product() {
      id, seller, name, price, mainImage, images
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});

test('One Item error', async () => {
  await request.post('/api/graphql')
    .send({query: `{product(id: "a4625a03-6938-4129-92f6-a7ade657202d") {
    id, seller, name, price, mainImage, images
  }}`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
    });
});

let accessToken: string | undefined;
test('Add product', async () => {
  accessToken = await asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{ createProduct(input: {
      price: 200,
      name: "item",
      description: "this is an item",
      category: "7f14a85c-4277-4ff7-971f-6b8e4858695c",
      subcategory: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe",
      attributes: """${JSON.stringify({condition: "new"})}""",
    }) {
      id, description, name, price
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.createProduct.id).toBeDefined();
      expect(res.body.data.createProduct.description).toBeDefined();
      expect(res.body.data.createProduct.name).toBeDefined();
      expect(res.body.data.createProduct.price).toBeDefined();
    });
});

test('Delete product', async () => {
  accessToken = await asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{ deleteProduct(id: "okok") }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.deleteProduct).toBeDefined();
    });
});

test('Delete product Fail', async () => {
  accessToken = await asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{ deleteProduct(id: "badID") }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined();
    });
});

test('Get all of own users listings', async () => {
  const accessToken = await asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `{getOwnProducts{
    id, seller, name
  }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      console.log(res.body);
      expect(res.body).toBeDefined();
      expect(res.body.data).toBeDefined();
      console.log(res.body.data);
      expect(res.body.data.getOwnProducts.length).toBeGreaterThan(0);
      expect(res.body.data.getOwnProducts[0].id).toEqual('p1ID');
    });
});

test('Get all of own ERR', async () => {
  const accessToken = await asNobby(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `{getOwnProducts{
    id, seller, name
  }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined();
    });
});

test('All Items Fetch Fail', async () => {
  restServer.close();
  await request.post('/api/graphql')
    .send({query: `{products {
      id, seller, name, price, mainImage, images
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined();
    });
  
});

test('Filtered Items Fetch Fail', async () => {
  restServer.close();
  await request.post('/api/graphql')
    .send({query: `{productsFiltered(filters:"{category:7f14a85c-4277-4ff7-971f-6b8e4858695c}") {
      id, seller, name, price, mainImage, images
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined();
    });
});

test('Create Product Fetch Fail', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{ createProduct(input: {
      price: 200,
      name: "item",
      description: "this is an item",
      category: "7f14a85c-4277-4ff7-971f-6b8e4858695c",
      subcategory: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe",
      attributes: """${JSON.stringify({condition: "new"})}""",
    }) {
      id, description, name, price
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined();
    });
});
