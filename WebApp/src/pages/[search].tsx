import Header from "../views/header";
import SearchAppBar from "../views/searchBar";
import { useRouter } from "next/router";
import Categories from "../views/Categories";
import { Box, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import ListingView from '../views/listingView';
import FilterBox from "../views/FilterBox";
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import LanguageChanger from "../views/LanguageChanger";
import Copyright from "../views/copyright";
import GuidelinesButton from "../views/guidelinesButton";
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'common',
      ])),
    },
  };
};

export default function SearchResult() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const queries = router.query;

  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filters, setFilters] = useState<{[key: string]: any}>({});
  const [filterProp, setFilterProp] = useState({});

  useEffect(() => {
    const temp:{[key: string]: string | string[] | undefined}= {};
    for (const [key, value] of Object.entries(queries)) {
      if (key !== 'search' && key !== 'q') {
        temp[key] = value;
      }
    }
    const temp2:{[key: string]: string | string[] | undefined} = {};
    for (const [key, value] of Object.entries(queries)) {
      if (key !== 'search') {
        if (key === 'PRICE_MIN') {
          temp2['price_min'] = value;
        } else if (key === 'PRICE_MAX') {
          temp2['price_max'] = value;
        } else {
          temp2[key] = value;
        }
      }
    }
    setFilters(temp);
    setFilterProp(temp2);
    setLoading(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, loading, queries]);

  return(
    <>
      {!loading &&
        <Box aria-label='results'>
          <Header></Header>
          <SearchAppBar></SearchAppBar>
          <Categories></Categories>
          <Grid container direction={'column'}>
            <Grid alignItems={'end'} alignContent={'flex-end'} textAlign={'end'} item sx={{width: '100%'}}>
              <FilterBox></FilterBox>
            </Grid>
            {queries['q'] &&
              <Grid item>
                {t('Current Search') + ':'}
                <Button
                  sx={{marginLeft: '3px'}}
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={() => {
                    router.push('/');
                  }}
                >
                  {queries['q']}
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
                            if (queries.q) {
                              temp += 'q=' + queries['q'] + '&';
                            }
                            
                            for (const [key, value] of Object.entries(filters)) {
                              if (key !== k) {
                                temp += key + '=' + value + '&';
                              }
                            }
                            router.push({
                              pathname: `/search`,
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
            <Grid item>
              <LanguageChanger />
            </Grid>
            <Grid item>
              <Copyright />
            </Grid>
            <Grid item>
              <GuidelinesButton />
            </Grid>
          </Grid>         
        </ Box>
      }
    </>
  )
}