import {render, screen, waitFor} from '@testing-library/react'
import {setupServer} from 'msw/node'
import {graphql} from 'msw'
import 'whatwg-fetch'
import mockRouter from 'next-router-mock';
import { createDynamicRouteParser } from "next-router-mock/dynamic-routes";
import Message, {getServerSideProps} from '../../pages/chat/[cid]'
import { GetServerSidePropsContext } from 'next'

const dummyAT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmMDYwNWNlLTBmZWEtNGEzMC05ZTU1LTE5MjEzMzZlYzExZCIsIm5hbWUiOiJUZXN0IFVzZXIgMSIsInJvbGVzIjpbImFkbWluIiwibW9kZXJhdG9yIiwibWVtYmVyIl0sImlhdCI6MTY3ODU3NzY1NiwiZXhwIjoxNjc4NTc5NDU2fQ.aC09SSj7mzuCV8r6dfadKfJVskuuUeNpoivmp5RQ53g'
const uid = JSON.parse(atob(dummyAT.split('.')[1])).id

const handlers = [
  graphql.query('messages', async (req, res, ctx) => {
    await req.json()
    return res(ctx.data({
      messages: [
        {id: "none", time: "T1", message:"M1", sender:uid},
        {id: "none", time: "T2", message:"M2", sender:"S2"},
        {id: "none", time: "T3", message:"M3", sender:"S3"},
      ],
    }))
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({onUnhandledRequest: 'warn'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', () => require('next-router-mock'));
mockRouter.useParser(createDynamicRouteParser([
  "/[cid]",
]));

const renderView = () => {
  const context = {
    locale: "en"
  }
  const context2 = {
  }
  getServerSideProps(context as GetServerSidePropsContext)
  getServerSideProps(context2 as GetServerSidePropsContext)
  mockRouter.push("/aef189e5-1d56-42e0-9dc9-d685e7aeb406");
  render(<Message />)
};

test('Render No Auth', async () => {
  renderView()
});

test('Renders', async () => {
  localStorage.setItem('user', `{"name":"test", "accessToken": "${dummyAT}"}`)
  renderView()
  await waitFor(()=>{
    expect(screen.getByText('M1')).not.toBeNull()
  })
});
