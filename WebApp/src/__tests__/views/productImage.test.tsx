import {render} from '@testing-library/react'
import 'whatwg-fetch'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import ProductImage from '../../views/productImage';

jest.mock('next/router', ()=> ({push: jest.fn()}))

const handlers = [
  graphql.query('products', async (req, res, ctx) => {
    return res(
      ctx.data({
        products: [{
          "id": "9f056fca-8a28-47cc-8631-4070fe201ec7",
          "seller": "9f056fca-8a28-47cc-8631-4070fe201ec7",
          "price:": "123",
          "name": "Toyota Prius",
          "mainImage": 'sdfdsf'
        }]
      }),
    )
  }),
  graphql.query('categories', async (req, res, ctx) => {
    return res(
      ctx.data({
        categories: [{
          "category": {"name": "Electronics & Media", "id": "adsfasdfdsf"},
          "subcategories": [{"name": "random", "id": "adsfasdfdsf"}, {"name": "test", "id": "sdfsd"}]
        }, {
          "category": {"name": "Electronics & Mediae", "id": "adsfasdfdsf"}
        }]
      }),
    )
  })
]
  
const server = setupServer(...handlers)
beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderView = () => {
  render(
    <ProductImage src="stdsf" width="100"/>
  ) 
};

test('Render Home', async () => {
  renderView()
});
