import {render} from '@testing-library/react'
import Sell, {getServerSideProps} from '../../pages/sell';
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import 'whatwg-fetch'
import { GetServerSidePropsContext } from 'next';
// import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => {
    if (key.includes('category.')) {
      return key.substring(key.indexOf('.') + 1);
    } else if (key.includes('sub.')) {
      return key.substring(key.indexOf('.') + 1);
    } else {
      return key;
    }
  }}),
}));

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
  const context = {
    locale: "en"
  }
  const context2 = {
  }
  getServerSideProps(context as GetServerSidePropsContext)
  getServerSideProps(context2 as GetServerSidePropsContext)
  render(<Sell/>);
}

test('Sell local storage set', async () => {
  localStorage.setItem('user', 'sdafsdf');
  renderView();
});

test('Sell local storage not set', async () => {
  localStorage.removeItem('user');
  renderView();
});