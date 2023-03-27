import supertest from 'supertest';
import * as http from 'http';
import requestHandler from './requestHandler';
import { rest } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;

const goodSubID = '78cc2d90-32e8-4c92-a659-a73aef0a6cfe'
const badSubID = '78cc2d90-32e8-4c92-a659-a73aff0a7aef'

const listURL = 'http://localhost:3012/api/v0/category/list/';
const subURL = 'http://localhost:3012/api/v0/category/subcategory/:id';
const restServer = setupServer(
  rest.get(subURL, async (req, res, ctx) => {
    return req.params.id === badSubID ? res(ctx.status(404)) :
      res(ctx.json({category: {id: "7f14a85c-4277-4ff7-971f-6b8e4858695c", name: "Electronics & Media"},
        subcategory: {id: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe", name: "Cameras & Photography", attributes: ""}}))
  }),
  rest.get(listURL, async (req, res, ctx) => {
    return res(ctx.json([
      {
        category : {
          id:'78cc2d90-32e8-4c92-a659-a73aef0a6cfe',
          name: "Test",
        },
        subcategories: [
          {
            id:'7f14a85c-4277-4ff7-971f-6b8e4858695c',
            name: "Test Sub 1",
            attributes: '{option: ["option1", "option2"], number: 0}'
          },
          {
            id:'7f14a85c-4277-4ff7-971f-6b8e4858695c',
            name: "Test Sub 2",
            attributes:'{option: ["option1", "option2"], number: 0}'
          }
        ]
      }
    ]))
  }),
);

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen();
  request = supertest(server);
  restServer.listen()
});

afterEach(() => restServer.resetHandlers());

afterAll((done) => {
  restServer.close();
  server.close(done);
});

test('Get All Categories', async () => {
  await request.post('/api/graphql')
    .send({query: `{categories {
      category {id, name},
      subcategories {id, name}
    }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      console.log(res.body);
      expect(res.body.data.categories[0].category).toBeDefined();
      expect(res.body.data.categories[0].category.id).toBeDefined();
      expect(res.body.data.categories[0].category.name).toBeDefined();
      expect(res.body.data.categories[0].subcategories[0].id).toBeDefined();
      expect(res.body.data.categories[0].subcategories[0].name).toBeDefined();
    });
});

test('Get Subcategory', async () => {
  await request.post('/api/graphql')
    .send({query: `{subcategoryDetails(id: "${goodSubID}") {
      category {id, name}, subcategory {id, name}}
    }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.subcategoryDetails.category).toBeDefined();
      expect(res.body.data.subcategoryDetails.category.id).toBeDefined();
      expect(res.body.data.subcategoryDetails.category.name).toBeDefined();
      expect(res.body.data.subcategoryDetails.subcategory).toBeDefined();
      expect(res.body.data.subcategoryDetails.subcategory.id).toBeDefined();
      expect(res.body.data.subcategoryDetails.subcategory.name).toBeDefined();
    });
});

test('Get Subcategory DNE', async () => {
  await request.post('/api/graphql')
    .send({query: `{subcategoryDetails(id: "${badSubID}") {
      category {id, name}, subcategory {id, name}}
    }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined()
    });
});

test('Category Fail Fetch', async () => {
  restServer.close()
  await request.post('/api/graphql')
    .send({query: `{categories {
      category {id, name},
      subcategories {id, name}
    }}`})
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res.body.errors).toBeDefined();
    });
});
