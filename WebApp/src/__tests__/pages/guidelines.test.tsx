import { fireEvent, render, screen } from '@testing-library/react'
import { setupServer } from 'msw/node';
import {graphql} from 'msw'
import 'whatwg-fetch'

import Guidelines, {getServerSideProps} from '../../pages/guidelines';
import GuidelinesButton from '../../views/guidelinesButton';
import { GetServerSidePropsContext } from 'next';

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

jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock('next/router', () => require('next-router-mock'));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => {
    return key;
  }}),
}));

const renderView = async () => {
  const context = {
    locale: "en"
  }
  const context2 = {
  }
  getServerSideProps(context as GetServerSidePropsContext)
  getServerSideProps(context2 as GetServerSidePropsContext)
  render(<GuidelinesButton />)
};

const renderGuidelines = async () => {
  render(<Guidelines />)
};

// click on guidelines button and render guidelines page
test('Renders', async () => {
  renderView();
  fireEvent.click(screen.getByText('Guidelines'));
  renderGuidelines();
});
