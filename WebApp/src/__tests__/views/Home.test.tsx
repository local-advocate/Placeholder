import {render, screen } from '@testing-library/react'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import Home from '../../views/home'
import 'whatwg-fetch'

jest.mock('next/router', () => require('next-router-mock'));

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
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => {
    if (key === 'title') {
      return 'Placeholder';
    }
  }}),
}));

const renderView = () => {
  render(<Home />)
};

// No need to test more, all individual components tested already
test('Renders', async () => {
  renderView();
  await screen.findByText('Placeholder')
});