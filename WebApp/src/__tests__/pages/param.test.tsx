import { render, screen, waitFor, fireEvent  } from '@testing-library/react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node';
import mockRouter from 'next-router-mock';
import 'whatwg-fetch'
import FilteredExplore, {getServerSideProps} from '../../pages/explore/category/[...param]';
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";
import { GetServerSidePropsContext } from 'next';

jest.mock('next/router', () => require('next-router-mock'));

mockRouter.useParser(createDynamicRouteParser([
  "/[...param]",
]));

const handlers = [
  graphql.query('productsFiltered', async (req, res, ctx) => {
    await req.json()
    return res(
      ctx.data({
        productsFiltered: [{
          "id": "1",
          "seller": "123",
          "price": "123",
          "name": "Toyota Prius",
          "images": ['sdfasdfsdf', 'sdfsdfdsf'],
          "mainImage": "dsafsdf"
        }]
      }),
    )
  }),
  graphql.query('categories', async (req, res, ctx) => {
    await req.json();
    return res(
      ctx.data({
        categories: [{
          "category": {"name": "Electronics & Media", "id": "categoryID"},
          "subcategories": [{"name": "random", "id": "subcategoryID"}, {"name": "test", "id": "sdfsd"}]
        }]
      }),
    )
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'warn'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderView = async (path: string) => {
  const context = {
    locale: "en"
  }
  const context2 = {
  }
  getServerSideProps(context as GetServerSidePropsContext)
  getServerSideProps(context2 as GetServerSidePropsContext)
  mockRouter.push(path);
  render(<FilteredExplore/>);
};

test('Renders', async () => {
  renderView("/categoryID/subcategoryID")
  await waitFor(()=>{
    expect(screen.findByText('Toyota Prius')).not.toBeNull();
    expect(screen.getAllByRole('link')[1]).toHaveAttribute('href', '/explore/category/categoryID');
  })
});

test('Filter in explorer', async () => {
  renderView("/categoryID/subcategoryID?q=toyota&PRICE_MIN=100&PRICE_MAX=200&condition=something");
  const q = await screen.findByText('toyota');
  fireEvent.click(q);
});

test('Click query string in explorer', async () => {
  renderView("/categoryID/subcategoryID?q=toyota");
  const q = await screen.findByText('toyota');
  fireEvent.click(q);
});

test('Clickquery filters in explorer', async () => {
  renderView("/categoryID/subcategoryID?q=toyota&PRICE_MIN=100&PRICE_MAX=500");
  const q = await screen.findByText('PRICE_MIN: 100');
  fireEvent.click(q);
});

test('Renders No Subcategory', async () => {
  renderView("/categoryID")
  await waitFor(()=>{
    expect(screen.findByText('Toyota Prius')).not.toBeNull();
    expect(screen.getAllByRole('link')[0]).toHaveAttribute('href', '/');
  })
});



test('Renders No Path', async () => {
  // server.use(
  //   graphql.query('categories', async (req, res, ctx) => {
  //     await req.json();
  //     return res(ctx.status(500))
  //   })
  // )
  renderView("/")
});
