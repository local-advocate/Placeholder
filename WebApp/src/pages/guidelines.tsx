import Typography from "@mui/material/Typography";
import Copyright from '../views/copyright';
import SearchAppBar from '../views/searchBar';
import Header from '../views/header';
import React from 'react';
import Categories from '../views/Categories';
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

export default function Guidelines() {
  return (
    <>
      <Header/>
      <SearchAppBar />
      <Categories/>
      <Typography component={'div'} sx={{ml: '20%'}}>
        <Typography variant='h3'>
        Guidelines
        </Typography>
        <Typography variant='h5' alignItems='center'>
        Listings
        </Typography>
        <Typography variant='subtitle1' alignItems='center'>
        Product listings should not include any of the following:
        </Typography>
        <Typography variant='subtitle2' sx={{ml: '25px'}}>
          <ul>
            <li>Website links</li>
            <li>Advertisements</li>
            <li>Personal information, such as an address or phone number</li>
            <li>Duplicate posts by the same user</li>
          </ul> 
        </Typography>
        <Typography variant='subtitle1' alignItems='center'>
        Any post violating these guidelines are subject to removal
        </Typography>
      </Typography>
      <Copyright />
    </>
  )
}