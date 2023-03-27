import {render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {setupServer} from 'msw/node'
import 'whatwg-fetch'
import SearchAppBar from '../../views/searchBar'

const server = setupServer()

beforeAll(() => server.listen({onUnhandledRequest: 'warn'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderListings = () => {
  render(
    <SearchAppBar/>
  ) 
};

test('Render Flagged Listings', async () => {
  userEvent.setup()
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"whatever", "id": "1"}`)
  renderListings()
});
