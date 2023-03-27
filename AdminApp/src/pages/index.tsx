import Home from '../views/Home';
import Header from '../views/header';
import { useEffect } from 'react';
import Router from 'next/router';

export default function Index() {
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      Router.push({
        pathname: '/login'
      })
    }
  })
  return (
    <>
      <Header/>
      <Home/>
    </>
  )
}