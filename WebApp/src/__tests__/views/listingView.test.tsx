import {render, screen, waitFor, configure, fireEvent } from '@testing-library/react'
import {setupServer} from 'msw/node'
import {graphql} from 'msw'
import 'whatwg-fetch'
import ListingView from '../../views/listingView'

const handlers = [
  graphql.query('products', async (req, res, ctx) => {
    await req.json()
    return res(ctx.data({
      products:[
        {id: 'Product 1', price: 1024, name: 'Product 1', mainImage: '111', seller: 'S1'},
        {id: 'Product 2', price: 1014, name: 'Product 2', mainImage: '111', seller: 'S2'},
        {id: 'Product 3', price: 1004, name: 'Product 3', mainImage: '111', seller: 'S3'},
        {id: 'Product 4', price: 1004, name: 'Product 4', mainImage: '111', seller: ''},
      ]
    }))
  }),
  graphql.query('productsFiltered', async (req, res, ctx) => {
    await req.json()
    return res(ctx.data({
      productsFiltered:[
        {id: 'Product 5', price: 1004, name: 'Product 5', mainImage: '111', seller: ''},
      ]
    }))
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'warn'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderHome = () => {
  render(
    <ListingView filters={''}/>
  ) 
};

const renderFiltered = () => {
  render(
    <ListingView filters={'filters'} />
  ) 
};

test('Render Home', async () => {
  renderHome()
  await waitFor(()=>{
    expect(screen.getByText('Product 1')).not.toBeNull()
    expect(screen.getByText('Product 2')).not.toBeNull()
    expect(screen.getByText('Product 3')).not.toBeNull()
  })
});

test('Render Filtered', async () => {
  renderFiltered()
  await waitFor(()=>{
    expect(screen.getByText('Product 5')).not.toBeNull()
  })
});

test('Clickables', async () => {
  renderHome()
  configure({testIdAttribute: 'id'})
  await waitFor(()=>{
    expect(screen.getByText('Product 1')).not.toBeNull()
    expect(screen.getByText('Product 2')).not.toBeNull()
  })
  fireEvent.click(screen.getAllByTestId('messageIcon')[0])
  fireEvent.click(screen.getAllByTestId('shareIcon')[0])
});

Object.assign(navigator, {
  clipboard: {
  //@typescript-eslint/no-empty-function
    writeText: () => {
      console.log();
    },
  },
});

describe("Clipboard", () => {
  describe("writeText", () => {
    jest.spyOn(navigator.clipboard, "writeText");
  });
});

test('Share', async () => {

  renderHome()
  configure({testIdAttribute: 'id'});
  await waitFor(()=>{
    expect(screen.getAllByTestId('shareIcon')).not.toBeNull()
  })
  fireEvent.click(screen.getAllByTestId('shareIcon')[0])
  await waitFor(()=>{
    expect(screen.getByText('Share Listing')).not.toBeNull()
  })
  fireEvent.click(screen.getByTestId('copytoclipboard'))
  fireEvent.keyDown(screen.getByText('Share Listing'), {key: 'Escape'});
  fireEvent.keyDown(screen.getByText('Copied to clipboard'), {key: 'Escape'})
  fireEvent.click(screen.getAllByTestId('shareIcon')[0])
  fireEvent.keyDown(screen.getByText('Share Listing'), {key: 'Escape'})
});