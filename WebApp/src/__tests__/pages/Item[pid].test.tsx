import { render, screen, waitFor  } from '@testing-library/react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node';
import mockRouter from 'next-router-mock';
import 'whatwg-fetch'
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";
import Item, {getServerSideProps} from '../../pages/item/detail/[pid]';
import { GetServerSidePropsContext } from 'next';

const handlers = [
  graphql.query('product', async (req, res, ctx) => {
    const json = await req.json()
    if (json.query.indexOf('2342349234802') >= 0) {
      return res(
        ctx.data({
          product: {
            "id": "2342349234802",
            "seller": "123",
            "price": "123",
            "name": "Toyota Prius",
            "images": ['sdfasdfsdf', 'sdfsdfdsf'],
            "mainImage": "dsafsdf"
          }
        }),
      )
    } else {
      return res(
        ctx.data({
        }),
      )
    }
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', () => require('next-router-mock'));
mockRouter.useParser(createDynamicRouteParser([
  "/[pid]",
]));

const renderView = async (path: string) => {
  const context = {
    locale: "en"
  }
  const context2 = {
  }
  getServerSideProps(context as GetServerSidePropsContext)
  getServerSideProps(context2 as GetServerSidePropsContext)
  mockRouter.push(path);
  render(<Item/>)
};

test('Renders', async () => {
  renderView("/2342349234802")
  await waitFor (() => {
    expect(screen.findByText('Toyota Prius')).not.toBeNull();
    expect(screen.findByText('Message Seller')).not.toBeNull();
    expect(screen.getByRole('img')).toBeVisible();
  });
});

test('Does not exist', async () => {
  renderView("/something");
  await waitFor (() => {
    expect(screen.findByText('Product does not exist')).not.toBeNull();
  });
});