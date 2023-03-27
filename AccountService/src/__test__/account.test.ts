import supertest from 'supertest';
import * as http from 'http';
import * as db from './db';
import app from '../app';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const loginApiPath = '/api/v0/account/login';
const signupApiPath = '/api/v0/account/signup';
const idApiPath = '/api/v0/account/id/';

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
  db.shutdown();
});

const test1 = {
  email: 'user1111@gmail.com',
  password: 'Test User 1111',
};

// Login OK
test('Login OK', async () => {
  await request.post(loginApiPath)
    .send(test1)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.name).toEqual('Test User 1');
      expect(res.body.roles).toEqual(['admin', 'moderator', 'member']);
      expect(res.body.email).toEqual('user1111@gmail.com');
      expect(res.body.id).toBeDefined();
    });
});

const dne = {
  email: 'dnednednedne@gmail.com',
  password: 'dnednednedne',
};

// Login User DNE
test('User DNE', async () => {
  await request.post(loginApiPath)
    .send(dne)
    .expect(404);
});

const badCreds = {
  email: 'user1111@gmail.com',
  password: 'badpwd',
};

// Bad Creds
test('Invalid Credentials', async () => {
  await request.post(loginApiPath)
    .send(badCreds)
    .expect(404);
});

const newUser = {
  email: 'newUserEmail@gmail.com',
  password: 'newUserPwd',
  name: 'New User'
};

// Signup OK
test('Signup OK', async () => {
  await request.post(signupApiPath)
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.name).toEqual(newUser.name);
      expect(res.body.email).toEqual(newUser.email);
      expect(res.body.roles).toEqual(['member']);
      expect(res.body.id).toBeDefined();
    });
});

// Signup Duplicate
test('Signup User Exists', async () => {
  await request.post(signupApiPath)
    .send(newUser)
    .expect(409)
});

// Get one
test('Get user name', async () => {
  await request.get(idApiPath + "4f0605ce-0fea-4a30-9e55-1921336ec11d")
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.user.name).toEqual('Test User 1');
    });
});

test('Get user not found', async () => {
  await request.get(idApiPath + "4f0605ce-0fea-4a30-9e55-1921336ec11e")
    .expect(404);
});

test('API Docs', async () => {
  await request.get('/api/v0/docs/')
    .expect(200);
});
