import supertest from 'supertest';
import * as http from 'http';
import requestHandler from './requestHandler';
import { rest } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

let gqlServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const signupURL = 'http://localhost:3011/api/v0/account/signup';
const restServer = setupServer(
  // Login
  rest.post(signupURL, async (req, res, ctx) => {
    const user = await req.json()
    return user.email === "posteduser@gmail.com" ? 
      res(ctx.json({id: 'userID', email: user.email, name: 'PostedUser', roles: ['member']})) :
      res(ctx.status(409, 'Already exists'))
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

const post = {
  email: "posteduser@gmail.com",
  password: "postedUser",
  name: "PostedUser"
};

test('Post OK', async () => {
  await request.post('/api/graphql')
    .send({query: `mutation {signup(input:{
        email: "${post.email}",
        password: "${post.password}",
        name: "${post.name}"}) {id, email, name, roles}}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data.body.data.signup).toBeDefined();
      expect(data.body.data.signup.id).toBeDefined();
      expect(data.body.data.signup.name).toEqual(post.name);
      expect(data.body.data.signup.email).toEqual(post.email);
    });
});

test('Post Duplicate', async () => {
  await request.post('/api/graphql')
    .send({query: `mutation {signup(input:{
          email: "nobby@gmail.com",
          password: "${post.password}",
          name: "${post.name}"}) {id, email, name, roles}}`})
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});

test('Signup No Credentials', async () => {
  await request.post('/api/graphql')
    .send({query: `mutation {signup() {id, email, name, roles}}`})
    .then((data) => {
      expect(data.body.errors.length).toEqual(1);
    });
});
