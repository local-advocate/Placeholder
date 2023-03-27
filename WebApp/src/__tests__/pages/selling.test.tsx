import {render} from '@testing-library/react'
import Selling, {getServerSideProps} from '../../pages/selling';
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import 'whatwg-fetch'
import { GetServerSidePropsContext } from 'next';
// import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));

const handlers = [
  graphql.query('getOwnProducts', async (req, res, ctx) => {
    return res(
      ctx.data({
        getOwnProducts: [{
          "id": "9f056fca-8a28-47cc-8631-4070fe201ec7",
          "seller": "9f056fca-8a28-47cc-8631-4070fe201ec7",
          "price:": "123",
          "name": "Toyota Prius",
          "mainImage": 'sdfdsf'
        },{
          "id": "9f056fca-8a28-47cc-8631-4070fe201ec7",
          "seller": "9f056fca-8a28-47cc-8631-4070fe201ec7",
          "price:": "123",
          "name": "Toyota Prius",
          "mainImage": 'sdfdsf'}]
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
    return key;
  }}),
}));

const renderView = () => {
  const context = {
    locale: "en"
  }
  const context2 = {
  }
  getServerSideProps(context as GetServerSidePropsContext)
  getServerSideProps(context2 as GetServerSidePropsContext)
  render(<Selling/>);
}

test('Render Page', async () => {
  localStorage.setItem('user', '{"accessToken": "sdfsad"}');
  renderView();
});

test('Render Not user', async () => {
  localStorage.removeItem('user')
  renderView();
});
