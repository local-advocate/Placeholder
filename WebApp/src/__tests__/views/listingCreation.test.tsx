import {render, screen, waitFor, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import ListingCreation from '../../views/listingCreation'
import 'whatwg-fetch'

jest.mock('next/router', () => require('next-router-mock'));
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
    if((req.headers.get('authorization') as string).indexOf('failImage') === -1){
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
  graphql.query('categories', async (req, res, ctx) => {
    // const json = await req.json()
    return res(
      ctx.data({categories: [{
        'category' : {
          'id': "1",
          'name': "General"
        },
        'subcategories' : [{
          'id': "2",
          'name': "For Sale",
          'attributes': '{}',
        }]
      }
      ]
      })
    )
  }),
  graphql.mutation('createProduct', async (req, res, ctx) => {
    console.log("createProduct")
    if((req.headers.get('authorization') as string).indexOf('whatever') >= 0){
      return res(
        ctx.data({createProduct: "Test"})
      )
    }else {
      return res(
        ctx.errors ([ {
          "message": "Unexpected error."
        }]),
      )
    }
  }),
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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => {
    if (key.includes('category')) {
      return key.substring(key.indexOf('.') + 1);
    } else if (key.includes('sub')) {
      return key.substring(key.indexOf('.') + 1);
    } else {
      return key;
    }
  }}),
}));
const renderView = () => {
  render(<ListingCreation />)
};

test("Renders", () => {
  renderView()
  expect(screen.getByText('Listing Title')).not.toBeNull();
})

test("Enter Text And Submit", async () => {

  const consoleSpy = jest.spyOn(console, 'log');
  const user = userEvent.setup()
  
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"whatever", "id": "1"}`)
 
  renderView()
  const title = screen.getByLabelText(/Title Input/i).children[1]
  await user.type(title, 'Car')
  const descr = screen.getByLabelText(/Description Input/i).children[1]
  await user.type(descr, 'This is a good car')
  const category = screen.getByLabelText(/Category/i)
  fireEvent.mouseDown(category.children[0]);
  await waitFor( () => {
    screen.findAllByText('General');
  })
  const general = await screen.findAllByText('General');
  fireEvent.click(general[1]);
  await waitFor( () => {
    screen.getByLabelText(/SubCategory/i)
  })
  const subcategory = screen.getByLabelText(/SubCategory/i)
  fireEvent.mouseDown(subcategory.children[0]);
  await waitFor( () => {
    screen.findAllByText('For Sale');
  })
  const sub = await screen.findAllByText('For Sale');
  fireEvent.click(sub[1]);

  const price = screen.getByLabelText(/Price Input/i).children[0]
  await userEvent.type(price, '5000');

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

  const creat = screen.getByLabelText('Create Listing')
  fireEvent.click(creat)
  await waitFor( () => {
    expect(consoleSpy).toHaveBeenCalledWith('Listing Created')
  })
  
})

test("Add Image And Delete Image", async () => {
  const consoleSpy = jest.spyOn(console, 'log');
  // const user = userEvent.setup()
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"whatever", "id": "1"}`)
 
  renderView()
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

  const del = screen.getByLabelText(/Delete/i)
  fireEvent.click(del)
  await waitFor( () => {
    expect(screen.queryAllByLabelText('Delete').length).toBe(0)
  })
})

test("Fail Listing Creation", async () => {
  const consoleSpy = jest.spyOn(console, 'log');
  const user = userEvent.setup()
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"fail", "id": "1"}`)
   
  renderView()
  const title = screen.getByLabelText(/Title Input/i).children[1]
  await user.type(title, 'Car')
  const descr = screen.getByLabelText(/Description Input/i).children[1]
  await user.type(descr, 'This is a good car')
  const category = screen.getByLabelText(/Category/i)
  fireEvent.mouseDown(category.children[0]);
  await waitFor( () => {
    screen.findAllByText('General');
  })
  const general = await screen.findAllByText('General');
  fireEvent.click(general[1]);
  await waitFor( () => {
    screen.getByLabelText(/SubCategory/i)
  })
  const subcategory = screen.getByLabelText(/SubCategory/i)
  fireEvent.mouseDown(subcategory.children[0]);
  await waitFor( () => {
    screen.findAllByText('For Sale');
  })
  const sub = await screen.findAllByText('For Sale');
  fireEvent.click(sub[1]);
  
  const price = screen.getByLabelText(/Price Input/i).children[0]
  await userEvent.type(price, '5000');
  
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
  
  const creat = screen.getByLabelText('Create Listing')
  fireEvent.click(creat)
  await waitFor( () => {
    expect(alerted).toBe(true)
  })
})

test("Fail Image Upload", async () => {
  const consoleSpy = jest.spyOn(console, 'log');
  const user = userEvent.setup()
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  localStorage.setItem('user', `{"name":"Molly Member","accessToken":"failImagewhatever", "id": "1"}`)
   
  renderView()
  const title = screen.getByLabelText(/Title Input/i).children[1]
  await user.type(title, 'Car')
  const descr = screen.getByLabelText(/Description Input/i).children[1]
  await user.type(descr, 'This is a good car')
  const category = screen.getByLabelText(/Category/i)
  fireEvent.mouseDown(category.children[0]);
  await waitFor( () => {
    screen.findAllByText('General');
  })
  const general = await screen.findAllByText('General');
  fireEvent.click(general[1]);
  await waitFor( () => {
    screen.getByLabelText(/SubCategory/i)
  })
  const subcategory = screen.getByLabelText(/SubCategory/i)
  fireEvent.mouseDown(subcategory.children[0]);
  await waitFor( () => {
    screen.findAllByText('For Sale');
  })
  const sub = await screen.findAllByText('For Sale');
  fireEvent.click(sub[1]);
  
  const price = screen.getByLabelText(/Price Input/i).children[0]
  await userEvent.type(price, '5000');
  
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
  
  const creat = screen.getByLabelText('Create Listing')
  fireEvent.click(creat)
  await waitFor( () => {
    expect(alerted).toBe(true)
  })
})

