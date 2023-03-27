import { render } from '@testing-library/react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

import Index, { getServerSideProps } from '../../pages/index';
import { GetServerSidePropsContext } from 'next';
const handlers = [
  graphql.query('filteredProducts', async (req, res, ctx) => {
    return res(
      ctx.data({
        filteredProducts: [{
          "id": "1",
          "seller": "123",
          "price:": "123",
          "name": "Toyota Prius"
        }, {
          "id": "1",
          "seller": "123",
          "price:": "123",
          "name": "Toyota Camry"
        },]
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
    if (key === 'title') {
      return 'Placeholder';
    }
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
  render(<Index/>)
};

// No need to test more, all individual components tested already
test('Renders', async () => {
  renderView()
});
