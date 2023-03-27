import {render, screen, waitFor, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {graphql} from 'msw'
import {setupServer} from 'msw/node'
import Login, {getServerSideProps} from '../../pages/login'
import 'whatwg-fetch'
import mockRouter from 'next-router-mock';
import { GetServerSidePropsContext } from 'next';

const handlers = [
  graphql.query('login', async (req, res, ctx) => {
    const json = await req.json()
    if (json.query.indexOf('user4444@gmail.com') >= 0) {
      return res(
        ctx.data({
          login: {
            "name": "User4",
            "accessToken": "whatever"
          }
        }),
      )
    } else {
      return res(
        ctx.errors ([ {
          "message": "Unexpected error."
        }]),
      )
    }
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => {
    if (key === 'No Account') {
      return 'Don‘t have an account? Sign up';
    } else {
      return key;
    }
  }}),
}));
jest.mock('next/router', () => require('next-router-mock'));

const renderView = () => {
  const context = {
    locale: "en"
  }
  const context2 = {
  }
  getServerSideProps(context as GetServerSidePropsContext)
  getServerSideProps(context2 as GetServerSidePropsContext)
  render(<Login />)
};

test('All components present', async () => {
  mockRouter.push("/login?from=from");
  renderView()
  expect(screen.getByText('Email Address')).not.toBeNull();
  expect(screen.getByText('Password')).not.toBeNull();
  expect(screen.getByText('Sign In')).toBeEnabled();
  expect(screen.getByText('Cancel')).toBeEnabled();
  expect(localStorage.getItem('user')).toBe(null);
});

test('Login Success', async () => {
  mockRouter.push("/login?from=from");
  renderView()
  const email = screen.getByText('Email Address')
  await userEvent.type(email, 'user4444@gmail.com')
  const passwd = screen.getByLabelText('Password')
  await userEvent.type(passwd, 'Test User 4444')
  fireEvent.click(screen.getByText('Sign In'))
  await waitFor(() => {
    expect(localStorage.getItem('user')).not.toBe(null)
  });
});


test('Login Success No From', async () => {
  mockRouter.push("/login");
  renderView()
  const email = screen.getByText('Email Address')
  await userEvent.type(email, 'user4444@gmail.com')
  const passwd = screen.getByLabelText('Password')
  await userEvent.type(passwd, 'Test User 4444')
  fireEvent.click(screen.getByText('Sign In'))
  await waitFor(() => {
    expect(localStorage.getItem('user')).not.toBe(null)
  });
});

test('Login Fail', async () => {
  renderView()
  let alerted = false
  window.alert = () => {
    alerted = true
  }
  fireEvent.click(screen.getByText('Sign In'))
  await waitFor(() => {
    expect(alerted).toBe(true)
  })
  expect(localStorage.getItem('user')).toBe(null)
});

test('Login Cancel', async () => {
  renderView()
  fireEvent.click(screen.getByText('Cancel'));
  expect(localStorage.getItem('user')).toBe(null);
  fireEvent.click(screen.getByText('Don‘t have an account? Sign up'))
});
