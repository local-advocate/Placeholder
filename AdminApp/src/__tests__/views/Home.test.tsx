import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { graphql } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

import Home from '../../views/Home';

const handlers = [
  graphql.query('categories', async (req, res, ctx) => {
    return res(
      ctx.data({
        categories: [{
          "category": {"name": "Electronics & Media", "id": "adsfasdfdsf"},
          "subcategories": [{"name": "random", "id": "adsfasdfdsf", "attributes": '{"name":"bob","tom":[1,2,3]}'}, {"name": "test", "id": "sdfsd", "attributes": '{"name":"bob","tom":[1,2,3]}'}]
        }, {
          "category": {"name": "other", "id": "adsfasdfdsf"}
        }]
      }),
    )
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock('next/router', () => require('next-router-mock'));

const renderView = async () => {
  render(<Home />)
};

test('Renders', async () => {
  renderView()
  await waitFor(() => {
    expect(screen.getByText('Electronics & Media')).not.toBeNull();
    expect(screen.findByText('random')).not.toBeNull();
    expect(screen.getByText('Create')).not.toBeNull();
    expect(screen.getByText('Admin')).not.toBeNull();
  })
  fireEvent.click(screen.getByText('Electronics & Media'));
  fireEvent.click(screen.getByText('Electronics & Media'));
  fireEvent.click(await screen.findByText('random'));
  fireEvent.click(screen.getByText('Create'));
  fireEvent.click(screen.getByText('Admin'));
});