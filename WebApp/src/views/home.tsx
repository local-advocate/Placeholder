import Copyright from './copyright';
import SearchAppBar from './searchBar';
import Header from './header';
import React from 'react';
import Categories from './Categories';
import ListingView from './listingView';
import GuidelinesButton from './guidelinesButton';
import LanguageChanger from './LanguageChanger';

export default function Home() {
  return (
    <>
      <Header/>
      <SearchAppBar />
      <Categories/>
      <ListingView filters={''} />
      <LanguageChanger />
      <Copyright />
      <GuidelinesButton/>
    </>
  )
}