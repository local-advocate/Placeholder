import supertest from 'supertest';
import * as http from 'http';
import requestHandler from './requestHandler';
import * as login from '../login';
import { rest } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

let gqlServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const loginURL = 'http://localhost:3011/api/v0/account/login';
const createURL = 'http://localhost:3013/api/v0/product';
const restServer = setupServer(
  // Login
  rest.post(loginURL, async (req, res, ctx) => {
    const user = await req.json()
    if (user.email === "user4444@gmail.com") {
      return res(ctx.json(
        {id: 'userID', name: 'Test User 4', roles: ['member', 'admin']},
      )) 
    }
    else if (user.email === "nobby@gmail.com") {
      return res(ctx.json(
        {id: 'nobby', name: 'Nobby', roles: []},
      ))
    }
    else return res(ctx.status(404, 'Not found'))
  }),
  // Create product
  rest.post(createURL, async (req, res, ctx) => {
    return res(ctx.json(
      {id: 'p6ID', seller: 'p6Seller', name: 'p6', price: 100, images: [], mainImage: 'x111', description: 'desc', condition: 'new'},
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

const bad = {
  email: 'noexist@gmail.com',
  password: 'badpassword',
};

test('OK', async () => {
  const member = login.test4;
  await request.post('/api/graphql')
    .send({query: `{login(email: "${member.email}" password: 
    "${member.password}") { name, accessToken }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.login.name).toEqual('Test User 4');
      expect(res.body.data.login.accessToken).toBeDefined();
    });
});

test('Invalid Credentials', async () => {
  await request.post('/api/graphql')
    .send({query: `{login(email: "${bad.email}" password: 
  "${bad.password}") { name, accessToken }}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toBeGreaterThan(0);
    });
});

test('Invalid Format Password', async () => {
  await request.post('/api/graphql')
    .send({query: `{login(email: "email@gmail.com" password: 
        "pwd") { name, accessToken }}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toBeGreaterThan(0);
    });
});

test('Invalid Format Email', async () => {
  await request.post('/api/graphql')
    .send({query: `{login(email: "emagmail.com" password: 
        "passworkOKOK") { name, accessToken }}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toBeGreaterThan(0);
    });
});


test('Not Member', async () => {
  const nobbyToken = await login.asNobby(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + nobbyToken)
    .send({query: `mutation{ createProduct(input: {
      price: 200,
      name: "item",
      category: "7f14a85c-4277-4ff7-971f-6b8e4858695c",
      subcategory: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe",
      description: "description",
      attributes: """${JSON.stringify({condition: "new"})}""",
    }) {
      id, seller, name, price
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});

let accessToken: string | undefined;
test('No Bearer', async () => {
  accessToken = await login.login(request, login.test4);
  await request.post('/api/graphql')
    .set('Authorization', 'B ' + accessToken)
    .send({query: `mutation{ createProduct(input: {
      price: 200,
      name: "item",
      category: "7f14a85c-4277-4ff7-971f-6b8e4858695c",
      subcategory: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe",
      description: "description",
      attributes: """${JSON.stringify({condition: "new"})}""",
    }) {
      id, seller, name, price
    }}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toBeGreaterThan(0);
    });
});

test('Check', async () => {
  accessToken = await login.login(request, login.test4);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{ createProduct(input: {
      price: 200,
      name: "item",
      category: "7f14a85c-4277-4ff7-971f-6b8e4858695c",
      subcategory: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe",
      description: "description",
      attributes: """${JSON.stringify({condition: "new"})}""",
    }) {
      id, seller, name, price
    }}`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.createProduct.id).toBeDefined();
    });
});

test('No auth header', async () => {
  await request.post('/api/graphql')
    .send({query: `mutation{ createProduct(input: {
      price: 200,
      name: "item",
      category: "7f14a85c-4277-4ff7-971f-6b8e4858695c",
      subcategory: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe",
      description: "description",
      attributes: """${JSON.stringify({condition: "new"})}""",
    }) {
      id, seller, name, price
    }}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toBeGreaterThan(0);
    });
});

test('Corrupt JWT', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + 'garbage')
    .send({query: `mutation{ createProduct(input: {
      price: 200,
      name: "item",
      category: "7f14a85c-4277-4ff7-971f-6b8e4858695c",
      subcategory: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe",
      description: "description",
      attributes: """${JSON.stringify({condition: "new"})}""",
    }) {
      id, seller, name, price
    }}`})
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.errors.length).toBeGreaterThan(0);
    });
});

test('Login Fail Fetch', async () => {
  restServer.close()
  const member = login.test4;
  await request.post('/api/graphql')
    .send({query: `{login(email: "${member.email}" password: 
    "${member.password}") { name, accessToken }}`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined();
    });
});