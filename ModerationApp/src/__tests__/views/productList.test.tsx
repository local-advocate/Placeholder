import {render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {setupServer} from 'msw/node'
import {graphql} from 'msw'
import 'whatwg-fetch'
import ProductList from '../../views/productList'

const handlers = [
  graphql.query('getFlaggedProducts', async (req, res, ctx) => {
    return res(ctx.data({
      getFlaggedProducts:[
        {id: 'Product 1', seller:  'me', price: 1024, name: 'Product 1', description: 'a', reason:'idk'},
        {id: 'Product 2', seller:  'me', price: 1014, name: 'Product 2', description: 'b', reason:'idk'},
        {id: 'Product 3', seller:  'me', price: 1004, name: 'Product 3', description: 'c', reason:'idk'},
      ]
    }))
  }),
  graphql.mutation('deleteListing', async (req, res, ctx) => {
    if((req.headers.get('authorization') as string).indexOf('whatever') >= 0){
      return res(
        ctx.data({deleteListing: 'Product 1'})
      )
    }else {
      return res(
        ctx.data({deleteListing: 'error'})
      )
    }
  }),
  graphql.mutation('approveProduct', async (req, res, ctx) => {
    if((req.headers.get('authorization') as string).indexOf('whatever') >= 0){
      return res(
        ctx.data({approveProduct: 'Product 2'})
      )
    }else {
      return res(
        ctx.data({approveProduct: 'error'})
      )
    }
  }),
  graphql.mutation('updateProduct', async (req, res, ctx) => {
    if((req.headers.get('authorization') as string).indexOf('whatever') >= 0){
      return res(
        ctx.data({updateProduct: 'Product 3'})
      )
    }else {
      return res(
        ctx.data({updateProduct: 'error'})
      )
    }
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'warn'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))

const renderListings = () => {
  render(
    <ProductList/>
  ) 
};

test('Render Flagged Listings', async () => {
  renderListings()
  await waitFor(()=>{
    expect(screen.getByText('Product 1')).not.toBeNull()
    expect(screen.getByText('Product 2')).not.toBeNull()
    expect(screen.getByText('Product 3')).not.toBeNull()
  })
});

test('Delete flagged listing fail', async () => {
  renderListings()
  await waitFor(()=>{
    expect(screen.getByText('Product 1')).not.toBeNull()
    expect(screen.getByText('Product 2')).not.toBeNull()
    expect(screen.getByText('Product 3')).not.toBeNull()
  })
  const deletebutton = await screen.findByLabelText('delete product Product 1');
  await userEvent.click(deletebutton);
});

test('Approve flagged listing fail', async () => {
  renderListings()
  await waitFor(()=>{
    expect(screen.getByText('Product 1')).not.toBeNull()
    expect(screen.getByText('Product 2')).not.toBeNull()
    expect(screen.getByText('Product 3')).not.toBeNull()
  })
  const approvebutton = await screen.findByLabelText('approve product Product 2');
  await userEvent.click(approvebutton);
});

test('Update flagged listing fail', async () => {
  const user = userEvent.setup()
  renderListings()
  await waitFor(()=>{
    expect(screen.getByText('Product 1')).not.toBeNull()
    expect(screen.getByText('Product 2')).not.toBeNull()
    expect(screen.getByText('Product 3')).not.toBeNull()
  })
  const editbutton = await screen.findByLabelText('edit product Product 3');
  await userEvent.click(editbutton);
  const name = screen.getByLabelText(/Product name/i);
  await user.type(name, 'new name');
  const description = screen.getByLabelText(/Product description/i);
  await user.type(description, 'new desc');
  const submitproduct = await screen.findByLabelText('submit product');
  await userEvent.click(submitproduct);
});

test('Delete flagged listing', async () => {
  userEvent.setup()
  
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"whatever", "id": "1"}`)
  renderListings()
  await waitFor(()=>{
    expect(screen.getByText('Product 1')).not.toBeNull()
    expect(screen.getByText('Product 2')).not.toBeNull()
    expect(screen.getByText('Product 3')).not.toBeNull()
  })
  const deletebutton = await screen.findByLabelText('delete product Product 1');
  await userEvent.click(deletebutton);
});

test('Approve flagged listing', async () => {
  userEvent.setup()
  
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"whatever", "id": "1"}`)
  renderListings()
  await waitFor(()=>{
    expect(screen.getByText('Product 1')).not.toBeNull()
    expect(screen.getByText('Product 2')).not.toBeNull()
    expect(screen.getByText('Product 3')).not.toBeNull()
  })
  const approvebutton = await screen.findByLabelText('approve product Product 2');
  await userEvent.click(approvebutton);
});

test('Update flagged listing', async () => {
  const user = userEvent.setup()
  
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"whatever", "id": "1"}`)
  renderListings()
  await waitFor(()=>{
    expect(screen.getByText('Product 1')).not.toBeNull()
    expect(screen.getByText('Product 2')).not.toBeNull()
    expect(screen.getByText('Product 3')).not.toBeNull()
  })
  const editbutton = await screen.findByLabelText('edit product Product 3');
  await userEvent.click(editbutton);
  const name = screen.getByLabelText(/Product name/i);
  await user.type(name, 'new name');
  const description = screen.getByLabelText(/Product description/i);
  await user.type(description, 'new desc');
  const submitproduct = await screen.findByLabelText('submit product');
  await userEvent.click(submitproduct);
});

test('Update flagged listing default values', async () => {
  userEvent.setup();
  
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"whatever", "id": "1"}`)
  renderListings()
  await waitFor(()=>{
    expect(screen.getByText('Product 1')).not.toBeNull()
    expect(screen.getByText('Product 2')).not.toBeNull()
    expect(screen.getByText('Product 3')).not.toBeNull()
  })
  const editbutton = await screen.findByLabelText('edit product Product 3');
  await userEvent.click(editbutton);
  const submitproduct = await screen.findByLabelText('submit product');
  await userEvent.click(submitproduct);
});