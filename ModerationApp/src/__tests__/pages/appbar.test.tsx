import { render, screen  } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

import SearchAppBar from '../../views/searchBar';

const server = setupServer()
beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', () => require('next-router-mock'));

const renderSearchBar = async () => {
  render(<SearchAppBar />)
}

test('Click login', async () => {
  renderSearchBar();
  const elem = await screen.findByText('Logout');
  await userEvent.click(elem);
  const apptext = await screen.findByText('Moderator App');
  await userEvent.click(apptext);
});

