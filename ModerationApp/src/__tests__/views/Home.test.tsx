import {render, screen } from '@testing-library/react'
import {setupServer} from 'msw/node'
import Home from '../../views/home'
import 'whatwg-fetch'

jest.mock('next/router', ()=> ({push: jest.fn()}))

const server = setupServer()
  
beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderView = () => {
  render(<Home />)
};

// No need to test more, all individual components tested already
test('Renders', async () => {
  renderView();
  await screen.findByText('Moderator App')
});