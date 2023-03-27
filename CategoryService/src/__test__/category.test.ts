import supertest from 'supertest';
import * as http from 'http';
import * as db from './db';
import app from '../app';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const listApiPath = '/api/v0/category/list';
const createApiPath = '/api/v0/category/create';
const deleteApiPath = '/api/v0/category/delete/';
const subcategoryApiPath = '/api/v0/category/subcategory/';

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

test('List', async () => {
  await request.get(listApiPath)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body).toBeDefined()
    });
});

test('Create', async () => {
  await request.post(createApiPath)
    .send({
      name: "Test",
      subcategories: [
        {
          name: "Test Sub 1",
          attributes: '{"option": ["option1", "option2"], "number": 0}'
        },
        {
          name: "Test Sub 2",
          attributes:'{"option": ["option1", "option2"], "number": 0}'
        }
      ]
    })
    .expect(201)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body).toBeDefined()
    });
})

test('Delete', async () => {
  await request.post(createApiPath)
    .send({
      name: "TestDelete",
      subcategories: [
        {
          name: "Test Sub 1",
          attributes: '{"option": ["option1", "option2"], "number": 0}'
        },
        {
          name: "Test Sub 2",
          attributes:'{"option": ["option1", "option2"], "number": 0}'
        }
      ]
    })
    .expect(201)
    .expect('Content-Type', /json/)
    .then(async (res) => {
      expect(res.body).toBeDefined()
      await request.get(deleteApiPath + res.body.category.id)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toBeDefined()
        });
    });


})

test('Delete Not There', async () => {
  await request.get(deleteApiPath + '2657c85d-def8-4ff1-bccd-9354d9249c18')
    .expect(404)

})

test('Swagger for CC', async () => {
  await request.get('/api/v0/docs/#')
    .expect(200)
})
  
test('Get subcategory and category', async () => {
  await request.get(subcategoryApiPath + "628a2def-7df5-472e-9c45-7cdf6cf5cc64")
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body).toBeDefined()
    });
});

test('Get subcategory and category not found', async () => {
  await request.get(subcategoryApiPath + "628a2def-7df5-472e-9c45-7cdf6cf5cc11")
    .expect(404)
});