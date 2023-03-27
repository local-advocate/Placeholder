import Home from '../views/home';
import Router from 'next/router'
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      Router.push({
        pathname: '/login'
      })
    }
  },[])
  return (
    <>
      <Home/>
    </>
  )
}