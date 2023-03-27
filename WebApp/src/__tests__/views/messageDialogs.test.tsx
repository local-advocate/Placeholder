/* eslint-disable @typescript-eslint/no-empty-function */

import {render, screen, waitFor, configure, fireEvent } from '@testing-library/react'
import {setupServer} from 'msw/node'
import {graphql} from 'msw'
import 'whatwg-fetch'
import { canMessage, messageSeller, CanMessageDialog, ContactSellerDialog, ShareDialog, SnackBar } from '../../views/messageDialogs'

const handlers = [
  graphql.query('canMsg', async (req, res, ctx) => {
    if (req.headers.get('Authorization')?.split(' ')[1] !== 'accessToken') {
      return res(ctx.status(500))
    }
    return res(ctx.data({bool: true}))
  }),
  graphql.query('conversation', async (req, res, ctx) => {
    const data = await req.json()
    if (data.variables.receiver === 'S2' || data.variables.receiver === 'S3') {
      return res(ctx.status(500))
    }
    return res(ctx.data({conversation:{conversation_id: 'C1'}}))
  }),
  graphql.mutation('createConversation', async (req, res, ctx) => {
    const data = await req.json()
    return data.variables.receiver === 'S3' ? res(ctx.status(500)) : res(ctx.data({createConversation:{conversation_id: 'C2'}}))
  }),
  graphql.query('getUser', async (req, res, ctx) => {
    const data = await req.json()
    return data.variables.receiver === 'S1' ? res(ctx.status(500)) : res(ctx.data({getUser:{name: 'U1'}}))
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'warn'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

test('Can Message Dialog', async () => {
  render(
    <CanMessageDialog 
      open={false}
      setCanMsg={()=>{}}
      from={'myself'}
    />
  )
  await waitFor(()=>{
    expect(screen.getByText('Login')).not.toBeNull()
    expect(screen.getByText('Signup')).not.toBeNull()
  })
  fireEvent.click(screen.getByText('Login'))
  fireEvent.click(screen.getByText('Signup'))
  fireEvent.keyDown(screen.getByText('Signup'), {key: 'Escape'})
});

test('Contact Seller Dialog', async () => {
  render(
    <ContactSellerDialog 
      open={true}
      setContactDialog={()=>{}}
      seller={'myself'}
      setSeller={()=>{}}
    />
  )
  await waitFor(()=>{
    expect(screen.getByText('Contact')).not.toBeNull()
    expect(screen.getByText('Cancel')).not.toBeNull()
  })
  fireEvent.click(screen.getByText('Cancel'))
  fireEvent.click(screen.getByText('Contact'))
  fireEvent.keyDown(screen.getByText('Cancel'), {key: 'Escape'})
});

test('Can Message Function ', async () => {
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')
  await canMessage(()=>{}, ()=>{})
  localStorage.removeItem('user')
  await canMessage(()=>{}, ()=>{})
})

test('Contact Seller Function ', async () => {
  await messageSeller('')       // empty seller
  await messageSeller('S1')     // get OK
  await messageSeller('S2')     // get Fail, Create OK
  await messageSeller('S3')     // create Fail
})

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

describe("Clipboard", () => {
  describe("writeText", () => {
    jest.spyOn(navigator.clipboard, "writeText");
  });
});

test('Share Dialog', async () => {
  render(
    <ShareDialog 
      open={true}
      onClose={()=>{}}
      onClick={()=>{}}
      link={'link'}
    />
  )
  configure({testIdAttribute: 'id'});
  await waitFor(()=>{
    expect(screen.getByText('Share Listing')).not.toBeNull()
  })
  fireEvent.keyDown(screen.getByText('Share Listing'), {key: 'Escape'});
  fireEvent.click(screen.getByTestId('copytoclipboard'))
});

test('SnackBar', async () => {
  render(<SnackBar open={true} onClose={()=>{}}/>)
  configure({testIdAttribute: 'id'});
  await waitFor(()=>{
    expect(screen.getByText('Copied to clipboard')).not.toBeNull()
  })
  fireEvent.keyDown(screen.getByText('Copied to clipboard'), {key: 'Escape'});
});