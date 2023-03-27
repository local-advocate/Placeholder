import { render } from '@testing-library/react'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

import Index from '../../pages/index';

const server = setupServer()
beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock('next/router', () => require('next-router-mock'));

const renderView = async () => {
  render(<Index />)
};

// No need to test more, all individual components tested already
test('Renders', async () => {
  renderView()
});
