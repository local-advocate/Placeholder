import {render, screen, waitFor, configure, fireEvent } from '@testing-library/react'
import {setupServer} from 'msw/node'
import 'whatwg-fetch'
import Index, {getServerSideProps} from '../../pages/chat'
import { GetServerSidePropsContext } from 'next'

const server = setupServer()

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', () => require('next-router-mock'));

const renderView = () => {
  const context = {
    locale: "en"
  }
  const context2 = {
  }
  getServerSideProps(context as GetServerSidePropsContext)
  getServerSideProps(context2 as GetServerSidePropsContext)
  render(<Index />)
};

test('Render No Auth', async () => {
  renderView()
});

test('Renders', async () => {
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')
  renderView()
  await waitFor(()=>{
    expect(screen.getByText('Conversations')).not.toBeNull()
  })
});

test('Clickables', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  fireEvent.click(screen.getByTestId('companyLogo'))
  fireEvent.click(screen.getByTestId('backArrow'))
  fireEvent.click(screen.getByText('Created'))
});
