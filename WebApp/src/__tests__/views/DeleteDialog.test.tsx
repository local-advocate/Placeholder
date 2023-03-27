import {fireEvent, render, screen} from '@testing-library/react'
import DeleteDialog from '../../views/DeleteDialog';
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
    } else {
      return key;
    }
  }}),
}));

const handlers = [
  graphql.mutation('deleteProduct', async (req, res, ctx) => {
    return res(
      ctx.data({
        deleteProduct: '123'
      }),
    )
  }),
]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderView = () => {
  render(<DeleteDialog name={'123'} id={'456'}/>);
}

test('Render Page', async () => {
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"whatever", "id": "1"}`)
  renderView();
});

test('Click yes', async () => {
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"whatever", "id": "1"}`)
  renderView();
  const del = await screen.findByTestId('DeleteIcon');
  fireEvent.click(del);
  const yes = await screen.findByText('Yes');
  fireEvent.click(yes);
});

test('Click No', async () => {
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"whatever", "id": "1"}`)
  renderView();
  const del = await screen.findByTestId('DeleteIcon');
  fireEvent.click(del);
  const no = await screen.findByText('No');
  fireEvent.click(no);
});
