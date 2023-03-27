import { render, screen, fireEvent, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { graphql } from 'msw'
import { setupServer } from 'msw/node';
import 'whatwg-fetch'

import Index from '../../pages/add/category/index';

const handlers = [
  graphql.mutation('createCategory', async (req, res, ctx) => {
    if(!req.headers.get('authorization')) {
      return res(
        ctx.errors([ {
          "message": "Unexpected error."
        }])
      )
    } else {
      return res(
        ctx.data({
          createCategory: {
            "category": {"name": "general", "id": "SDFDSF"},
            "subcategories": [{"name": "general", "id": "SDFDSF"}, {"name": "general", "id": "SDFDSF"}]
          }
        }),
      )
    }
  }),
]

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock('next/router', () => require('next-router-mock'));

const renderView = async () => {
  render(<Index />)
};

test('Renders', async () => {
  renderView()
  await screen.findByText('Create');
});

test('Enter Category Name', async () => {
  renderView();
  localStorage.setItem('user', '{"accessToken": "sdfsdf"}');
  const cat = screen.getByText('Category Name');
  await userEvent.type(cat, 'newCategory');
  await userEvent.click(await screen.findByText('Create'));
  const subcat = screen.getByLabelText('Subcategory');
  fireEvent.click(subcat);
  await userEvent.type(subcat, 'newSubCategory');
  await userEvent.click(await screen.findByText('Create'));
});

test('Add more subcategory', async () => {
  renderView();
  localStorage.setItem('user', '{"accessToken": "sdfsdf"}');
  const cat = screen.getByText('Category Name');
  await userEvent.type(cat, 'newCategory');
  const addMore = screen.getByText('+ Add SubCategory');
  await userEvent.click(addMore);
  const all = screen.getAllByLabelText('Subcategory');
  const del = screen.getAllByLabelText('delete');
  fireEvent.mouseDown(all[1]);
  await userEvent.type(all[1], 'newSubCategory');
  fireEvent.click(all[0]);
  await userEvent.type(all[0], 'hellomate');
  await userEvent.click(del[0]);
  await userEvent.click(await screen.findByText('Create'));
});

test('Error', async () => {
  renderView();
  const cat = screen.getByText('Category Name');
  await userEvent.type(cat, 'newCategory');
  const subcat = screen.getByLabelText('Subcategory');
  fireEvent.click(subcat);
  await userEvent.type(cat, 'newCategory');
  fireEvent.change(subcat.querySelector('input'), {target: {value: 'chanes'}});
  await userEvent.click(await screen.findByText('Create'));
});

test('Clicking every button', async () => {
  renderView();
  localStorage.setItem('user', '{"accessToken": "sdfsdf"}');
  const cat = screen.getByText('Category Name');
  await userEvent.type(cat, 'newCategory');
  const addMore = screen.getByText('+ Add SubCategory');
  await userEvent.click(addMore);
  const all = screen.getAllByLabelText('Subcategory');
  const del = screen.getAllByLabelText('delete');
  fireEvent.mouseDown(all[1]);
  await userEvent.type(all[1], 'newCategory');
  fireEvent.click(all[0]);
  await userEvent.type(all[0], 'hellomate');
  const addAttribute = screen.getAllByText('+ Add Attribute');
  await userEvent.click(addAttribute[0]);
  // fireEvent.mouseDown(addAttribute[0]);
  // fireEvent.mouseDown(addAttribute[1]);
  // const attributes = screen.getAllByLabelText('Attribute');
  // fireEvent.mouseDown(attributes[0]);
  // await userEvent.type(attributes[0], 'hello');
  const options = screen.getAllByLabelText('Option');
  fireEvent.mouseDown(options[0]);
  await userEvent.type(options[0], 'newCategory');
  await userEvent.click(del[0]);
  await userEvent.click(await screen.findByText('Create'));
});

test('Attributes', async () => {
  renderView();
  localStorage.setItem('user', '{"accessToken": "sdfsdf"}');
  // add attrs
  const addAttribute = screen.getAllByText('+ Add Attribute');
  await userEvent.click(addAttribute[0])
  await userEvent.click(addAttribute[0])
  // delete attr
  await userEvent.click(screen.getAllByTestId('DeleteIcon', {exact: false})[0])
  // create
  await userEvent.click(await screen.findByText('Create'));
  // type attr name
  const attributes = screen.getAllByLabelText('Attribute Name', {exact: false});
  await userEvent.type(attributes[0], 'attribute');
  // add option
  await userEvent.click(screen.getAllByText('+ Option')[0])
  await userEvent.click(screen.getAllByText('+ Option')[0])
  // delete option
  await userEvent.click(screen.getAllByTestId('DeleteIcon', {exact: false})[0])
  // type option
  const options = await screen.findAllByLabelText('Option Name', {exact: false});
  await userEvent.type(options[0], 'option');
  // select
  const selectorr = within(await screen.findByLabelText('Type'))
  fireEvent.mouseDown(selectorr.getByText('Enum'))
  const listbox = within(await screen.findByRole('listbox'))
  fireEvent.click(listbox.getByText('Number'))
});

// TESTS LEFT
// - type in option not working
// - Create error not working
// - Add subcategory, ADd subcategor, add attrbiutes to second category
// - add one of the attribute of type number, create