import supertest from 'supertest';
import * as http from 'http';
import requestHandler from './requestHandler';
import { rest } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'
import * as login from '../login';

let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let request: supertest.SuperTest<supertest.Test>;
const listURL = 'http://localhost:3012/api/v0/category/list';
const subURL = 'http://localhost:3012/api/v0/category/subcategory/78cc2d90-32e8-4c92-a659-a73aef0a6cfe';
const createURL = 'http://localhost:3012/api/v0/category/create';
const loginURL = 'http://localhost:3011/api/v0/account/login';


const restServer = setupServer(
  rest.get(subURL, async (req, res, ctx) => {
    console.log("Getting one subcategory")
    return res(ctx.json({category: {id: "7f14a85c-4277-4ff7-971f-6b8e4858695c", name: "Electronics & Media"},
      subcategory: {id: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe", name: "Cameras & Photography", attributes: ""}}))
  }),
  rest.post(createURL, async (req, res, ctx) => {
    const data = await req.json();
    console.log(data.name)
    if(data.name === 'new category') {
      return res(ctx.json({category: {id: "7f14a85c-4277-4ff7-971f-6b8e4858695c", name: "new category"},
        subcategories: [{id: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe", name: "general"}, {id: "78cc2d90-32e8-4c92-a659-a73aef0a6cfe", name: "help"}]}))
    } else {
      return res(ctx.status(500))
    }
  }),
  rest.get(listURL, async (req, res, ctx) => {
    console.log("Getting categories")
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
  rest.post(loginURL, async (req, res, ctx) => {
    return res(ctx.json(
      {id: 'userID', name: 'Test User 4', roles: ['member', 'admin']},
    )) 
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
  //db.shutdown();
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
      console.log(res.body.data);
      expect(res.body.data.categories[0].category).toBeDefined();
      expect(res.body.data.categories[0].category.id).toBeDefined();
      expect(res.body.data.categories[0].category.name).toBeDefined();
      expect(res.body.data.categories[0].subcategories[0].id).toBeDefined();
      expect(res.body.data.categories[0].subcategories[0].name).toBeDefined();
    });
});

test('Create new Category', async () => {
  const accessToken = await login.asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
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
      console.log(res.body.data);
      expect(res.body.data.createCategory).toBeDefined();
      expect(res.body.data.createCategory.category.id).toBeDefined();
      expect(res.body.data.createCategory.category.name).toEqual("new category");
      expect(res.body.data.createCategory.subcategories).toBeDefined();
      expect(res.body.data.createCategory.subcategories[0].id).toBeDefined();
      expect(res.body.data.createCategory.subcategories[0].name).toEqual("general");
      expect(res.body.data.createCategory.subcategories[1].name).toEqual("help");
    });
});

test('Create new Category No Attributes', async () => {
  const accessToken = await login.asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{createCategory (input: {
    name: "new category",
    subcategories: ["general", "help"],
    attributes: []}) {
      category{id, name}
      subcategories{id, name}
    }
  }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.data.createCategory).toBeDefined();
      expect(res.body.data.createCategory.category.id).toBeDefined();
      expect(res.body.data.createCategory.category.name).toEqual("new category");
      expect(res.body.data.createCategory.subcategories).toBeDefined();
      expect(res.body.data.createCategory.subcategories[0].id).toBeDefined();
      expect(res.body.data.createCategory.subcategories[0].name).toEqual("general");
      expect(res.body.data.createCategory.subcategories[1].name).toEqual("help");
    });
});

test("Create Category Error", async () => {
  const accessToken = await login.asTest1(request);
  await request.post('/api/graphql')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({query: `mutation{createCategory (input: {
    name: "new",
    subcategories: ["general", "help"],
    attributes: []}) {
      category{id, name}
      subcategories{id, name}
    }
  }`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.errors).toBeDefined();
    });
});

test("Get Fetch Fail", async () => {
  restServer.close()
  await request.post('/api/graphql')
    .send({query: `{categories {
    category {id, name},
    subcategories {id, name}
  }}`})
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined()
      expect(res.body).toBeDefined()
      expect(res.body.errors).toBeDefined()
    })
})

// test('Delete Category', async () => {
//   const accessToken = await login.asTest1(request);
//   await request.post('/api/graphql')
//     .set('Authorization', 'Bearer ' + accessToken)
//     .send({query: `mutation{deleteCategory (input: {
//     id: "${id}"}) {
//       id, name
//     }
//   }`})
//     .expect(200)
//     .expect('Content-Type', /json/)
//     .then((res) => {
//       expect(res).toBeDefined();
//       expect(res.body).toBeDefined();
//       expect(res.body.data.deleteCategory.id).toBeDefined();
//       expect(res.body.data.deleteCategory.name).toBeDefined();
//       expect(res.body.data.deleteCategory.id).toEqual(id);
//     });
// });

// test('Delete Category Error', async () => {
//   const accessToken = await login.asTest1(request);
//   await request.post('/api/graphql')
//     .set('Authorization', 'Bearer ' + accessToken)
//     .send({query: `mutation{deleteCategory (input: {
//     id: "${id}"}) {
//       id, name
//     }
//   }`})
//     .expect(200)
//     .expect('Content-Type', /json/)
//     .then((res) => {
//       expect(res).toBeDefined();
//       expect(res.body).toBeDefined();
//       expect(res.body.errors).toHaveLength(1);
//     });
// });