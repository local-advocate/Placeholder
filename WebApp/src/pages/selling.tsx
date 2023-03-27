import SearchAppBar from "../views/searchBar";
import Header from "../views/header";
import Categories from '../views/Categories';
import Listings from '../views/Listings';
import Copyright from "../views/copyright";
import GuidelinesButton from "../views/guidelinesButton";
import Router from 'next/router'
import { useEffect } from "react";
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'common',
      ])),
    },
  };
};

export default function Selling(){
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      Router.push({
        pathname: '/login?from=/selling'
      })
    }
  })
  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Header/>
        <SearchAppBar />
        <Categories/>
        <Listings/>
        <div style={{marginTop: "auto"}}>
          <Copyright />
          <GuidelinesButton/>
        </div>
      </div>
    </>
  )
}