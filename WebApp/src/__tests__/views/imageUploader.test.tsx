import {render, screen, waitFor, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import ImageUploader from '../../views/imageUpload'
import 'whatwg-fetch'

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

const handlers = [
  graphql.mutation('uploadImage', async (req, res, ctx) => {
    // const json = await req.json()
    console.warn(req.headers)
    if((req.headers.get('authorization') as string).indexOf('whatever') >= 0){
      return res(
        ctx.data({uploadImage: "Test"})
      )
    }else {
      return res(
        ctx.errors ([ {
          "message": "Unexpected error."
        }]),
      )
    }
      
  }),
]
  
const server = setupServer(...handlers)
  
beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderView = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  render(<ImageUploader addImage={() => {}}/>)
};

test('Renders', async () => {
  renderView();
  // const fakeFile = new File(['hello'], 'hello.png', { type: 'image/png' });
  screen.getByText('Select Image');

})

test('Upload Image', async () => {
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"whatever", "id": "1"}`)
  renderView();
  const consoleSpy = jest.spyOn(console, 'log');
  const fakeFile = new File(['hello'], 'hello.png', { type: 'image/png' });
  const fileInput = screen.getByText('Select Image');
  await userEvent.upload(fileInput.children[0] as HTMLElement, fakeFile)
  screen.getByText('hello.png');
  await waitFor( () => {
    screen.getByLabelText('preview')
  })
  const upload = screen.getByText('Add Image To Listing')
  fireEvent.click(upload)
  await waitFor( () => {
    expect(consoleSpy).toHaveBeenCalledWith('Got Image')
  })
})
