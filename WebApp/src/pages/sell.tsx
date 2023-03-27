import ListingCreation from "../views/listingCreation";
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

export default function CreateListing(){
  useEffect(() => {
    if (!localStorage.getItem('user') || localStorage.getItem('user') == null) {
      Router.push({
        pathname: '/login?from=/sell'
      })
    }else{
      console.log(localStorage.getItem('user'))
    }
  })
  return(
    <ListingCreation/>
  )
}