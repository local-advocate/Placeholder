import {fireEvent, render, screen} from '@testing-library/react'
import Listings from '../../views/Listings';
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import 'whatwg-fetch'
// import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => {
    if (key === 'Listings') {
      return 'Your Listings';
    } else if (key === 'No Listing') {
      return 'You have no listings';
    }
  }}),
}));

const handlers = [
  graphql.query('getOwnProducts', async (req, res, ctx) => {
    return res(
      ctx.data({
        getOwnProducts: [{
          "id": "1",
          "seller": "9f056fca-8a28-47cc-8631-4070fe201ec7",
          "price:": "123",
          "name": "Toyota Prius",
          "mainImage": 'sdfdsf'
        },{
          "id": "2",
          "seller": "9f056fca-8a28-47cc-8631-4070fe201ec7",
          "price:": "123",
          "name": "Toyota Prius",
          "mainImage": 'sdfdsf'}]
      }),
    )
  }),
  graphql.operation(async (req, res, ctx) => {
    return res(
      ctx.data({
        getOwnProducts: [{
          "id": "1",
          "seller": "9f056fca-8a28-47cc-8631-4070fe201ec7",
          "price:": "123",
          "name": "Toyota Prius",
          "mainImage": 'sdfdsf'
        },{
          "id": "2",
          "seller": "9f056fca-8a28-47cc-8631-4070fe201ec7",
          "price:": "123",
          "name": "Toyota Prius",
          "mainImage": 'sdfdsf'}]
      }),
    )
  }),
  
]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderView = () => {
  render(<Listings/>);
}

test('Render Page', async () => {
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"whatever", "id": "1"}`)
  renderView();
  // screen.getByText('123');
});

test('Render Page Unauthorized', async () => {
  renderView();
});

test('Click delete', async () => {
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"whatever", "id": "1"}`)
  renderView();
  const button = await screen.findByLabelText('delete_1');
  fireEvent.click(button);
  await screen.findByText('Your Listings')
});

// test('Click item', async () => {
//   lo
// }
