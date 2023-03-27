import {render, screen, fireEvent, waitFor, configure } from '@testing-library/react'
import ProductView, {hex_to_ascii} from '../../views/productView'
import {setupServer} from 'msw/node'
import {graphql} from 'msw'
import 'whatwg-fetch'

const handlers = [
  graphql.query('subcategoryDetails', async (req, res, ctx) => {
    await req.json()
    return res(ctx.data({
      subcategoryDetails : {category: {id: '1', name: 'me'}, subcategory: {id: '2', name: 'idk', attributes: 'ok'}}
    }))
  }),
  graphql.query('getUser', async (req, res, ctx) => {
    await req.json()
    return res(ctx.data({
      getUser: {id: '123', name: 'testuser'}
    }))
  }),
  graphql.query('canMsg', async (req, res, ctx) => {
    if (req.headers.get('Authorization')?.split(' ')[1] !== 'accessToken') {
      return res(ctx.status(500))
    }
    return res(ctx.data({bool: true}))
  }),

]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'warn'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => {
    if (key.includes('category.')) {
      return key.substring(key.indexOf('.') + 1);
    } else if (key.includes('sub.')) {
      return key.substring(key.indexOf('.') + 1);
    } else {
      return key;
    }
  }}),
}));

const product = {id: '12312', seller: 'abdul', price: 120, category: 'electronics',
  subcategory: 'phone', name: 'Phone', mainImage: '23423', images: ['23423', 'asdf'],
  condition: 'used', description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'};

const supernullproduct = {id: '11111', price: 120, category: 'electronics',
  name: 'Phone', mainImage: '23423', images: ['23423', 'asdf']};

const thirdproduct = {id: '111', price: 120, category: 'electronics',
  name: 'Phone', mainImage: '23423', images: ['23423', 'asdf'], seller:'abduljr', attributes:'{"a":"a1","b":"b1"}'};

const renderView = () => {
  render(<ProductView product={product}/>)
};

test('Renders', async () => {
  renderView();
});

test('Change img page', async () => {
  renderView();
  fireEvent.click(await screen.findByLabelText('Go to next page'))
});

test('hex to ascii test', async () => {
  const str = hex_to_ascii('image source')
  expect(str).not.toBeNull()
});

test('Render null condition + description', async () => {
  render(<ProductView product={supernullproduct}/>);
  fireEvent.click(await screen.findByLabelText('Go to next page'))
});

test('Message Cancel', async () => {
  render(<ProductView product={thirdproduct}/>);
  configure({testIdAttribute: 'id'});
  localStorage.setItem('user', '{"name":"test", "accessToken": "accessToken"}')
  await waitFor(()=>{
    expect(screen.getByText('Message Seller')).not.toBeNull()
  })
  fireEvent.click(screen.getByText('Message Seller'))
  await waitFor(()=>{
    expect(screen.getByText('Cancel')).not.toBeNull()
  })
  fireEvent.click(screen.getByText('Cancel'))
  await waitFor(()=>{
    expect(screen.queryByText('Cancel')).toBeNull()
  })
})
