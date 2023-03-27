import {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import * as React from 'react';
import ListingView from '../../../views/listingView';
import { CategoryList } from '../../../graphql/category/schema';
import { GraphQLClient, gql } from 'graphql-request';
import Link from 'next/link'
import Header from '../../../views/header';
import SearchAppBar from '../../../views/searchBar';
import Categories from '../../../views/Categories';
import Copyright from '../../../views/copyright';
import { SearchContext } from '../../../views/context';
import GuidelinesButton from '../../../views/guidelinesButton';
import { Grid } from '@mui/material';
import FilterBox from '../../../views/FilterBox';
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import LanguageChanger from '../../../views/LanguageChanger';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'common',
      ])),
    },
  };
};

export default function FilteredExplore() {
  const { t } = useTranslation('common');
  const router = useRouter()
  const queries = router.query;
  const {q} = router.query;
  const [categories, setCategories] = useState<CategoryList[]|undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filters, setFilters] = useState<{[key: string]: any}>({});
  const [filterProp, setFilterProp] = useState({});
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [queryStr, setQueryStr] = useState('');

  useEffect(() => {
    if(router.isReady) {
      const temp:{[key: string]: string | string[] | undefined} = {};
      for (const [key, value] of Object.entries(queries)) {
        if (key !== 'param' && key !== 'q') {
          temp[key] = value;
        }
      }
      const temp2:{[key: string]: string | string[] | undefined} = {};

      for (const [key, value] of Object.entries(queries)) {
        if (key !== 'param') {
          if (key === 'PRICE_MIN') {
            temp2['price_min'] = value;
          } else if (key === 'PRICE_MAX') {
            temp2['price_max'] = value;
          } else {
            temp2[key] = value;
          }
        } else {
          if (value && value[0]) {
            temp2['category'] = value[0];
          }
          if (value && value[1]) {
            temp2['subcategory'] = value[1];
          }
        }
      }

      setCategory(queries.param ? queries.param[0]: '');
      setSubcategory(queries.param ? queries.param[1]: '');
      setFilters(temp);
      setFilterProp(temp2);
      setQueryStr('');
      if (router.query.q) {
        setQueryStr(`?q=${router.query.q}`);
      }

      // get categories
      const fetch = (async () => {
        const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {})
        const query = gql`
            query categories {
              categories {
                category{id, name}, subcategories{id, name}
              }
            }
          `
        const data = await graphQLClient.request(query);
        setCategories(data.categories);
      });
  
      fetch()
        .catch(console.error);
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  // for Path to current category Home > Category > Subcategory
  let item;
  if (router.isReady) item = categories?.find(item => item.category.id === (queries.param? queries.param[0]: undefined))

  return (
    <> 
      {Object.keys(filterProp).length===0 ? '': 
        <>
          <Header/>
          <SearchContext.Provider
            value={
              {currCategory: category, currSubcategory: subcategory, setCategory: setCategory, setSubcategory: setSubcategory}
            }>
            <SearchAppBar />
            <Categories/>
            {/* Path to current category Home > Category > Subcategory */}
            <i>
              <Link href='/' style={{textDecoration: 'none'}}>{t('Home')}</Link>
              &gt;{queries.param && queries.param[1]?<Link href={`/explore/category/${item?.category.id}` + queryStr} style={{textDecoration: 'none'}}>{t('category.' + item?.category.name)}</Link>:t('category.' + item?.category.name)}
              &gt;{queries.param && queries.param[1]?t('sub.' + item?.subcategories.find(it => it.id === (queries.param ? queries.param[1]: undefined))?.name):''}
            </i>
            <Grid container direction={'column'}>
              <Grid alignItems={'end'} alignContent={'flex-end'} textAlign={'end'} item sx={{width: '100%'}}>
                <FilterBox></FilterBox>
              </Grid>
              {q &&
                <Grid item>
                  {t('Current Search') + ':'}
                  <Button
                    sx={{marginLeft: '3px'}}
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={() => {
                      let url = router.asPath.replace(`q=${encodeURIComponent(q as string)}`, '');
                      if (url.indexOf('?') == url.length - 1) {
                        url = url.replace('?', '');
                      } else {
                        url = url.replace('&', '');
                      }
                      router.push(url);
                    }}
                  >
                    {q}
                  </Button>
                </Grid>
              }
              {Object.keys(filters).length > 0 && 
                <Grid item>
                  {t('Current Filter')}
                  <Grid container spacing={2} direction={'row'}>
                    {Object.keys(filters).map((k) => 
                      <Grid item key={k}>
                        <Button
                          sx={{marginLeft: '3px'}}
                          variant="outlined"
                          startIcon={<ClearIcon />}
                          onClick={() => {
                            let temp = '';
                            let temp2 = '/explore/category';
                            if (queries.q) {
                              temp += 'q=' + queries['q'] + '&';
                            }
                            
                            for (const [key, value] of Object.entries(filters)) {
                              if (key !== k) {
                                temp += key + '=' + value + '&';
                              }
                            }

                            if (category && category !== '') {
                              temp2 += `/${category}`
                            }

                            if (subcategory && subcategory !== '') {
                              temp2 += `/${subcategory}`
                            }

                            router.push({
                              pathname: temp2,
                              query: temp.substring(0, temp.length - 1),
                            })
                          }}
                        >
                          {k}: {filters[k]}
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              }
              <Grid item>
                <ListingView filters={JSON.stringify(filterProp)} />
              </Grid>
            </Grid>  
          </SearchContext.Provider>
          <LanguageChanger />
          <Copyright />
          <GuidelinesButton />
        </>
      }
    </>
  );
}