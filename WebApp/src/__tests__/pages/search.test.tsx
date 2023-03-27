import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { graphql } from 'msw'
import { setupServer } from 'msw/node';
import mockRouter from 'next-router-mock';
import 'whatwg-fetch'

import { SearchContext } from '../../views/context';
import SearchResult, {getServerSideProps} from '../../pages/[search]';
import SearchAppBar from '../../views/searchBar';
import FilterBox from '../../views/FilterBox';
import { GetServerSidePropsContext } from 'next';

const handlers = [
  graphql.query('product', async (req, res, ctx) => {
    return res(
      ctx.data({
        product: [{
          "id": "1",
          "seller": "123",
          "price:": "123",
          "name": "Toyota Prius",
          "mainImage": '111'
        }]
      }),
    )
  }),
  graphql.query('productsFiltered', async (req, res, ctx) => {
    return res(
      ctx.data({
        productsFiltered: [{
          "id": "1",
          "seller": "123",
          "price:": "123",
          "name": "Toyota Prius",
          "mainImage": '111'
        }, {
          "id": "2",
          "seller": "123",
          "price:": "123",
          "name": "Toyota Camry",
          "mainImage": '111'
        }, {
          "id": "3",
          "seller": "123",
          "price:": "123",
          "mainImage": '111'
        },]
      }),
    )
  }),
  graphql.query('categories', async (req, res, ctx) => {
    return res(
      ctx.data({categories: [{
        'category' : {
          'id': "catId",
          'name': "General"
        },
        'subcategories' : [{
          'id': "subcatId",
          'name': "For Sale",
          'attributes': '{"number":0,"condition":["new", "old"]}',
        }]
      }
      ]
      })
    )
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

global.structuredClone = jest.fn(val => {
  return JSON.parse(JSON.stringify(val));
})
jest.mock('next/router', () => require('next-router-mock'));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => {
    if (key === 'title') {
      return 'Placeholder';
    } else {
      return key;
    }
  }}),
}));

const renderSearchResult = async () => {
  const context = {
    locale: "en"
  }
  const context2 = {
  }
  getServerSideProps(context as GetServerSidePropsContext)
  getServerSideProps(context2 as GetServerSidePropsContext)
  mockRouter.push("/search?q=toyota&PRICE_MIN=1000&PRICE_MAX=2000&condition=something");
  render(<SearchResult/>);
};

const renderSearchResult2 = async () => {
  mockRouter.push("/search?q=toyota");
  render(<SearchResult/>);
};

const renderFilter = async () => {
  mockRouter.push("/explore/category/catId/subcatId?q=toyota&PRICE_MIN=1000&PRICE_MAX=2000");
  render(
    <SearchContext.Provider value={{
    /* eslint-disable */
    currCategory: 'catId',
    currSubcategory: 'subcatId',
    setCategory: (catId: string) => {},
    setSubcategory: (subcatId: string) => {},
    /* eslint-enable */
    }}>
      <FilterBox/>;
    </SearchContext.Provider>
  )
};

const renderFilter2 = async () => {
  mockRouter.push("/explore/category/catId?q=toyota&PRICE_MIN=1000&PRICE_MAX=2000");
  render(
    <SearchContext.Provider value={{
    /* eslint-disable */
    currCategory: 'catId',
    setCategory: (catId: string) => {},
    setSubcategory: (subcatId: string) => {},
    /* eslint-enable */
    }}>
      <FilterBox/>;
    </SearchContext.Provider>
  )
};

const renderSearchBar = async () => {
  render(<SearchAppBar />)
}

const renderSearchBar2 = async () => {
  render(
    <SearchContext.Provider value={{
      /* eslint-disable */
      currCategory: 'someCategory',
      setCategory: (catId: string) => {},
      setSubcategory: (subcatId: string) => {},
      /* eslint-enable */
    }}>
      <SearchAppBar />
    </SearchContext.Provider>
  )
}

const renderSearchBar3 = async () => {
  render(
    <SearchContext.Provider value={{
      /* eslint-disable */
      currCategory: 'someCategory',
      currSubcategory: 'someSubcategory',
      setCategory: (catId: string) => {},
      setSubcategory: (subcatId: string) => {},
      /* eslint-enable */
    }}>
      <SearchAppBar />
    </SearchContext.Provider>
  )
}

test('Renders', async () => {
  renderSearchResult();
});

test('Search Bar Typing', async () => {
  renderSearchBar();
  const elem = await screen.findByLabelText('Search...');
  await userEvent.type(elem, 'toyota');
  await screen.findByText('Toyota Prius');
  await userEvent.type(elem, '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}');
  const title = await screen.findByText('Placeholder');
  fireEvent.click(title);
  await screen.findByLabelText('Search...');
})

test('Search Bar Click Option', async () => {
  renderSearchBar();
  const elem = await screen.findByLabelText('Search...');
  await userEvent.type(elem, 'toyota');
  const opt = await screen.findByText('Toyota Prius');
  fireEvent.click(opt);
  await screen.findByText('Placeholder');
})

test('Search Bar Free Enter', async () => {
  renderSearchBar();
  const elem = await screen.findByLabelText('Search...');
  await userEvent.type(elem, 'nonexistent');
  await userEvent.keyboard('{enter}');
  await screen.findByLabelText('Search...');
})

test('Search Bar Free Enter in category', async () => {
  renderSearchBar2();
  const elem = await screen.findByLabelText('Search...');
  await userEvent.type(elem, 'nonexistent');
  await userEvent.keyboard('{enter}');
  await screen.findByLabelText('Search...');
})

test('Search Bar Free Enter in subcategory', async () => {
  renderSearchBar3();
  const elem = await screen.findByLabelText('Search...');
  await userEvent.type(elem, 'nonexistent');
  await userEvent.keyboard('{enter}');
  await screen.findByLabelText('Search...');
})

test('Search Bar Free Enter in category', async () => {
  renderSearchBar2();
  const elem = await screen.findByLabelText('Search...');
  await userEvent.type(elem, 'toyota');
  const opt = await screen.findByText('Toyota Prius');
  fireEvent.click(opt);
  await screen.findByText('Placeholder');
})

test('Search Bar Free Enter in subcategory', async () => {
  renderSearchBar3();
  const elem = await screen.findByLabelText('Search...');
  await userEvent.type(elem, 'toyota');
  const opt = await screen.findByText('Toyota Prius');
  fireEvent.click(opt);
  await screen.findByText('Placeholder');
})

test('Login, Signup Click', async () => {
  renderSearchBar();
  const elem = await screen.findByText('Login');
  await userEvent.click(elem);
  const elem2 = await screen.findByText('Signup');
  await userEvent.click(elem2);
  const placeholder = await screen.findByText('Placeholder');
  await userEvent.click(placeholder);
});

test('Sell and Selling', async () => {
  localStorage.setItem('user', JSON.stringify({'name': 'Bob'}));
  renderSearchBar();
  const elem = await screen.findByText('Sell');
  await userEvent.click(elem);
  const selling = await screen.findByText('Selling');
  await userEvent.click(selling);
});

test('Chat', async () => {
  localStorage.setItem('user', JSON.stringify({'name': 'Bob'}));
  renderSearchBar();
  const elem = await screen.findByText('Chats');
  await userEvent.click(elem);
});

test('Open Filter', async () => {
  renderSearchResult();
  const filter = await screen.findByLabelText('filter_button');
  fireEvent.click(filter);
  const apply = await screen.findByText('Apply');
  const min = await screen.findByLabelText('Min');
  await userEvent.type(min, '1000');
  const max = await screen.findByLabelText('Max');
  await userEvent.type(max, '2000');
  await userEvent.click(apply);
});

test('Open Filter Cancel', async () => {
  renderSearchResult();
  const filter = await screen.findByLabelText('filter_button');
  fireEvent.click(filter);
  const cancel = await screen.findByText('Cancel');
  await userEvent.click(cancel);
});

test('Render filter with subcategory', async () => {
  renderFilter();
  const filter = await screen.findByLabelText('filter_button');
  fireEvent.click(filter);
  const apply = await screen.findByText('Apply');
  const min = await screen.findByLabelText('Min');
  await userEvent.type(min, '1000');
  const max = (await screen.findAllByLabelText('Max'))[0];
  await userEvent.type(max, '2000');
  const numberMin = await screen.findByLabelText('Min numberfield');
  await userEvent.type(numberMin, '123');
  const numberMax = await screen.findByLabelText('Max numberfield');
  await userEvent.type(numberMax, '123');
  const select = await screen.findByLabelText('conditionmenu');
  fireEvent.click(select);
  screen.debug(undefined, 300000);
  // const options = await screen.findByLabelText('newoption');
  // fireEvent.click(options);
  await userEvent.click(apply);
});

test('Render filter with category', async () => {
  renderFilter2();
  const filter = await screen.findByLabelText('filter_button');
  fireEvent.click(filter);
  const apply = await screen.findByText('Apply');
  const min = await screen.findByLabelText('Min');
  await userEvent.type(min, '1000');
  const max = await screen.findByLabelText('Max');
  await userEvent.type(max, '2000');
  await userEvent.click(apply);
});

test('Click query string and filters in search', async () => {
  renderSearchResult();
  const q = await screen.findByText('toyota');
  fireEvent.click(q);
});

test('CLick query string in search', async () => {
  renderSearchResult2();
  const q = await screen.findByText('toyota');
  fireEvent.click(q);
});

test('Click filter in search', async () => {
  renderSearchResult();
  const q = await screen.findByText('PRICE_MIN: 1000');
  fireEvent.click(q);
});

test('Logout', async () => {
  localStorage.setItem('user', '{"accessToken": "sdfsad"}');
  renderSearchBar();
  const button = await screen.findByLabelText('account of current user');
  fireEvent.click(button);
  fireEvent.click(button);
  fireEvent.click(button);
  const logout = await screen.findByText('Logout');
  fireEvent.click(logout);
});
