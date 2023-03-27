import {render, screen, configure, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {setupServer} from 'msw/node'
import {graphql} from 'msw'
import 'whatwg-fetch'
import MessageBox from '../../views/messageBox'

const handlers = [
  graphql.mutation('createMessage', async (req, res, ctx) => {
    await req.json()
    return res(ctx.data({
      createMessage: {id: "cc63ab2c-ba12-44d1-8db1-9cd159c5a4fc", time: "time"}
    }))
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'warn'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderView = () => {
  render(<MessageBox id={'id'} />)
};

test('Renders', async () => {
  renderView()
});

test('Text & Button Present', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  expect(screen.getByTestId('sendMessageBox')).toBeVisible();
  expect(screen.getByTestId('sendMessageIcon')).not.toBeNull();
});

test('Type message, Send', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')
  const box = screen.getByTestId('sendMessageBox')
  fireEvent.click(box)
  await userEvent.type(box, 'Message')
  fireEvent.click(screen.getByTestId('sendMessageIcon'))
});

test('Empty message, Send', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')
  const box = screen.getByTestId('sendMessageBox')
  fireEvent.click(box)
  fireEvent.click(screen.getByTestId('sendMessageIcon'))
});

test('Create Message, No Auth', async () => {
  renderView()
  configure({testIdAttribute: 'id'});
  localStorage.removeItem('user')
  const box = screen.getByTestId('sendMessageBox')
  fireEvent.click(box)
  await userEvent.type(box, 'Message')
  fireEvent.click(screen.getByTestId('sendMessageIcon'))
});
