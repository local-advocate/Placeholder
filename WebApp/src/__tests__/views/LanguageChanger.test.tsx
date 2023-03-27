import { fireEvent, render, screen } from '@testing-library/react'
import { setupServer } from 'msw/node';
import mockRouter from 'next-router-mock';
import 'whatwg-fetch'

import LanguageChanger from '../../views/LanguageChanger';

const server = setupServer()

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock('next/router', () => require('next-router-mock'));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => {
    if (key === 'title') {
      return 'Placeholder';
    } else {
      if (key.includes('language')) {
        return key.substring(key.indexOf('.') + 1);
      }
    }
  }}),
}));

const renderView = async () => {
  mockRouter.locale = 'en';
  render(<LanguageChanger />)
};
const renderView2 = async () => {
  mockRouter.locale = 'fr';
  render(<LanguageChanger />)
};

test('Renders English', async () => {
  renderView();
  const button = await screen.findByText('English');
  fireEvent.mouseDown(button);
  const opt = await screen.findByText('French');
  fireEvent.click(opt);
});

test('Renders French', async () => {
  renderView2();
  const button = await screen.findByText('French');
  fireEvent.mouseDown(button);
  const opt = await screen.findByText('English');
  fireEvent.click(opt);
});
