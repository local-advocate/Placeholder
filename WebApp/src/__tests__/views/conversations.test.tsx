import {render, screen, waitFor, configure, fireEvent } from '@testing-library/react'
import {setupServer} from 'msw/node'
import {graphql} from 'msw'
import 'whatwg-fetch'
import { SelectionContext } from '../../views/chatContext'
import Conversations from '../../views/conversations'

const handlers = [
  graphql.query('conversations', async (req, res, ctx) => {
    await req.json()
    const auth = req.headers.get('Authorization')?.split(' ')[1]
    return auth==='badAuth' ? res(ctx.status(500)) : res(ctx.data({
      conversations: {
        sent: [
          {cid: "cc63ab2c-ba12-44d1-8db1-9cd159c5a4fc", name: "Name1", message:{message:"M1"}},
          {cid: "cc63ab1c-ba12-44d1-8db1-9cd159c5a4fc", name: "Name2", message:{message:"M2"}},
        ],
        received: []
      }
    }))
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'warn'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderCtx = (selection: string) => {
  render(
    <SelectionContext.Provider value={{
      selection: selection, setSelection:(s)=>(s)
    }}>
      <Conversations />
    </SelectionContext.Provider>
  )
};

const renderNoContext = () => {
  render(
    <Conversations />
  ) 
};

test('No Auth Fetch Fail', async () => {
  localStorage.setItem('user', '{"name":"test", "accessToken": "badAuth"}')
  renderNoContext()
});

test('Render Sent', async () => {
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')
  renderCtx('Created')
  await waitFor(()=>{
    expect(screen.getByText('Name1')).not.toBeNull()
    expect(screen.getByText('Name2')).not.toBeNull()
  })
});

test('Render Received', async () => {
  renderCtx('Received')
  await waitFor(()=>{
    expect(screen.getByText(`You have no 'Received' conversations...`)).not.toBeNull()
  })
});

test('Click conversation', async () => {
  renderCtx('Created')
  configure({testIdAttribute: 'id'});
  await waitFor(()=>{
    expect(screen.getByText('Name1')).not.toBeNull()
  })
  fireEvent.click(screen.getByTestId('cc63ab2c-ba12-44d1-8db1-9cd159c5a4fc'))
});

test('No Auth Render', async () => {
  localStorage.removeItem('user')
  renderNoContext()
});
