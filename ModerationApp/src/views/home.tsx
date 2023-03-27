import Copyright from './copyright';
import Header from './header';
import SearchBar from './searchBar';
import React from 'react';
import ProductList from './productList';
export default function Home() {
  return (
    <>
      <Header/>
      <SearchBar/>
      <ProductList/>
      <Copyright />
    </>
  )
}