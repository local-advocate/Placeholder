import {render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import Categories from '../../views/Categories';
import mockRouter from 'next-router-mock';
import 'whatwg-fetch'

jest.mock('next/router', () => require('next-router-mock'));

const handlers = [
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
  
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => {
    if (key.includes('category')) {
      return key.substring(key.indexOf('.') + 1);
    } else if (key.includes('sub')) {
      return key.substring(key.indexOf('.') + 1);
    }
  }}),
}));

const renderView = () => {
  render(<Categories/>)
};

const renderViewQuery = () => {
  mockRouter.push("/explore/category/catId/subcatId?q=toyota&condition=something");
  render(<Categories/>)
};

const renderViewQuery2 = () => {
  mockRouter.push("/explore/category/catId?q=toyota");
  render(<Categories/>)
};

const renderViewQuery3 = () => {
  mockRouter.push("/explore/category/catId/subcatId");
  render(<Categories/>)
};

test('Renders Base', async () => {
  renderView();
  await userEvent.click(await screen.findByText('Electronics & Media'));
});

test('Renders Query Context', async () => {
  renderViewQuery2();
  await userEvent.click(await screen.findByText('Electronics & Media'));
});

test('Hover', async () => {
  renderView();
  const electronic = await screen.findByText('Electronics & Media');
  userEvent.hover(electronic);
  await screen.findByText('random');
  userEvent.unhover(electronic)
  await waitFor(async () => {
    expect((await screen.findAllByText('random')).length === 0)
  })
});

test('Click', async () => {
  renderView();
  const electronic = await screen.findByText('Electronics & Media');
  userEvent.hover(electronic);
  const test = await screen.findByText('test');
  await userEvent.click(test);
});

test('Click with query context in subcategory', async () => {
  renderViewQuery();
  const electronic = await screen.findByText('Electronics & Media');
  userEvent.hover(electronic);
  const test = await screen.findByText('test');
  await userEvent.click(test);
}); 

test('Click with query context in category', async () => {
  renderViewQuery2();
  const electronic = await screen.findByText('Electronics & Media');
  userEvent.hover(electronic);
  const test = await screen.findByText('test');
  await userEvent.click(test);
}); 

test('Click subcategory without query and filter', async () => {
  renderViewQuery3();
  const electronic = await screen.findByText('Electronics & Media');
  userEvent.hover(electronic);
  const test = await screen.findByText('test');
  await userEvent.click(test);
}); 

test('Unhover', async () => {
  renderView();
  const electronic = await screen.findByText('Electronics & Media');
  userEvent.hover(electronic);
  const test = await screen.findByText('test');
  await userEvent.hover(test);
  await userEvent.unhover(test);
});