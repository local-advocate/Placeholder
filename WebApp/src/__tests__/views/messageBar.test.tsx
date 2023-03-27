import {render, screen, configure, fireEvent } from '@testing-library/react'
import {setupServer} from 'msw/node'
import MessageBar from '../../views/messageAppBar'

const server = setupServer()

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renders = () => {
  render(<MessageBar />)
};

test('Renders', async () => {
  renders()
});

test('Clickables', async () => {
  renders()
  configure({testIdAttribute: 'id'});
  fireEvent.click(screen.getByTestId('IconButtonID'))
  fireEvent.click(screen.getByTestId('companyButton'))
});

test('Name', async () => {
  localStorage.setItem('name', 'name')
  renders()
});