import supertest from 'supertest';
import * as http from 'http';
import requestHandler from './requestHandler';
import * as login from '../login';
import { rest } from 'msw'
import { setupServer } from 'msw/node';
import { sign } from "jsonwebtoken"
import 'whatwg-fetch'

let gqlServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const loginURL = 'http://localhost:3011/api/v0/account/login';
const createURL = 'http://localhost:3012/api/v0/category/create';
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
  // Create category
  rest.post(createURL, async (req, res, ctx) => {
    await req.json();
    return res(ctx.json({category: {id: "7f14a85c-4277-4ff7-971f-6b8e4858695c", name: "new category"},
      subcategories: [{id: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe", name: "general"}, {id: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe", name: "help"}]}))
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

test('Not admin', async () => {
  await request.post('/api/graphql')
    .send({query: `{login(email: "nobby@gmail.com" password: 
    "Test User 6666") { name, accessToken }}`})
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
    .send({query: `mutation{createCategory (input: {
    name: "new category",
    subcategories: ["general", "help"],
    attributes: ["a1", "a2"]}) {
      category{id, name}
      subcategories{id, name}
    }
  }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
});

test('No auth header', async () => {
  await request.post('/api/graphql')
    .send({query: `mutation{createCategory (input: {
    name: "new category",
    subcategories: ["general", "help"],
    attributes: ["a1", "a2"]}) {
      category{id, name}
      subcategories{id, name}
    }
  }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
});

test('Corrupt JWT', async () => {
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer garbage')
    .send({query: `mutation{createCategory (input: {
    name: "new category",
    subcategories: ["general", "help"],
    attributes: ["a1", "a2"]}) {
      category{id, name}
      subcategories{id, name}
    }
  }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
});

test('Bad roles', async () => {
  const memberAt = sign({id: 'id', name: 'name', roles: ['member']},
    process.env.ACCESS_TOKEN as string, {
      expiresIn: '30m',
      algorithm: 'HS256'
    })
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + memberAt)
    .send({query: `mutation{createCategory (input: {
    name: "new category",
    subcategories: ["general", "help"],
    attributes: ["a1", "a2"]}) {
      category{id, name}
      subcategories{id, name}
    }
  }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
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