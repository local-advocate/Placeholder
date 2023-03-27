import { useState, useContext, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, Grid } from '@mui/material';
import Router from 'next/router';
import { useRouter } from "next/router";
import { SearchContext } from "./context";
import { GraphQLClient, gql } from "graphql-request";
import { flushSync } from "react-dom";
import { Select, MenuItem } from "@mui/material";
import { CategoryList, Subcategory } from "../graphql/category/schema";
import { useTranslation } from "next-i18next";

// https://mui.com/material-ui/react-dialog/

export default function FilterBox() {
  const { t } = useTranslation('common');
  const ctx = useContext(SearchContext);
  const router = useRouter();
  const { q } = router.query;
  const [open, setOpen] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [att, setAtt] = useState<{[key:string]:any}>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filter, setFilter] = useState<{[key:string]:any}>({});

  useEffect(() => {
    setAtt({});
    setFilter({});
    const fetchData = (async () => {
      const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {})
      const query = gql`
        query categories {
          categories {
            category{id, name},
            subcategories{id, name, attributes}
          }
        }
      `
      const data = await graphQLClient.request(query);
      return data.categories;
    });
    fetchData()
      .then((res) => {
        if (ctx?.currSubcategory) {
          const category = res.find((a: CategoryList) => a.category.id === ctx?.currCategory);
          const subcategory = category.subcategories.find((a: Subcategory) => a.id === ctx?.currSubcategory);
          const attributes = JSON.parse(subcategory.attributes);
          flushSync(() => {
            setFilter(attributes);
          })
        }
      })
      .catch(() => {
        // console.log('error');
      });
  }, [ctx?.currCategory, ctx?.currSubcategory]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }

  const handleApply = () => {
    setOpen(false);
    let queries = '';
    if (q) {
      queries += 'q=' + q + '&';
    }
    for (const [key, value] of Object.entries(router.query)) {
      if (key !== 'param' && key !== 'search' && key !== 'q') {
        if (!att[key]) {
          queries += key + '=' + value + '&';
        }
      }
    }

    for (const [key, value] of Object.entries(att)) {
      if (value !== '') {
        queries += key + '=' + value + '&';
      }
    }
    

    setAtt({});

    if(ctx?.currSubcategory) {
      Router.push({
        pathname: `/explore/category/${ctx?.currCategory}/${ctx?.currSubcategory}`,
        query: queries.substring(0, queries.length - 1),
      });
    } else if (ctx?.currCategory) {
      Router.push({
        pathname: `/explore/category/${ctx?.currCategory}`,
        query: queries.substring(0, queries.length - 1),
      });
    } else {
      Router.push({
        pathname: `/search`,
        query: queries.substring(0, queries.length - 1),
      })
    }
  };

  const renderFilters = () => {
    return(
      <Grid container spacing={3} direction={'column'}>
        {Object.keys(filter).map((key) => 
          <Grid key={key} item>
            <Divider></Divider>
            <DialogContentText>
              {t(key.charAt(0).toUpperCase() + key.slice(1))}:
            </DialogContentText>
            {typeof(filter[key]) === 'number' &&
                <Grid item>
                  <TextField aria-label={"Min " + key + "field"} defaultValue = {router.query['min_'+key] ? router.query['min_'+key] : ''} label = {t('Min')} type="number" variant="standard" margin="dense" onChange={(e) => {
                    const temp = structuredClone(att);
                    temp['min_'+key] = e.target.value;
                    setAtt(temp);
                  }}/>
                  <TextField aria-label={"Max " + key + "field"} defaultValue = {router.query['max_'+key] ? router.query['max_'+key] : ''} label = {t('Max')} type="number" variant="standard" margin="dense" onChange={(e) => {
                    const temp = structuredClone(att);
                    temp['max_'+key] = e.target.value;
                    setAtt(temp);
                  }}/>
                </Grid>
            }
            {typeof(filter[key]) === 'object' && 
                <Grid item>
                  <Select
                    aria-label={key + 'menu'}
                    value={(router.query[key]) ? (att[key] ? att[key] : router.query[key]) : (att[key] ? att[key] : '')}
                    onChange={(e) => {
                      const temp = structuredClone(att);
                      temp[key] = e.target.value;
                      setAtt(temp);
                    }}
                  >
                    {filter[key].map((a: string) => {
                      return <MenuItem aria-label={a + 'option'} key={a} value={a}>{a}</MenuItem>
                    })}
                  </Select>
                </Grid>
            }
          </Grid>
        )}
      </Grid>
    )
  }

  return (
    <div>
      <Button aria-label="filter_button" variant="outlined" onClick={handleClickOpen}>
        {t('Filter')}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('Filter')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('Price Range') + ':'}
          </DialogContentText>
          <Grid rowSpacing={1} justifyContent={'flex-start'} alignItems={'flex-start'} container direction={'row'}>
            <Grid item sx={{width: '25%'}}>
              <TextField
                name='min_price'
                margin="dense"
                id="min_price"
                label={t('Min')}
                variant="standard"
                type="number"
                defaultValue = {router.query['PRICE_MIN'] ? router.query['PRICE_MIN'] : ''}
                onChange={(event) => {
                  const temp = structuredClone(att);
                  temp.PRICE_MIN = event?.target.value;
                  setAtt(temp);
                }}
              />
            </Grid>
            <Grid marginTop={'7%'} marginLeft={'5%'} marginRight={'5%'} item>
              {t('To')}
            </Grid>
            <Grid item sx={{width: '25%'}}>
              <TextField
                name='max_price'
                margin="dense"
                id="max_price"
                label={t('Max')}
                variant="standard"
                type="number"
                defaultValue = {router.query['PRICE_MAX'] ? router.query['PRICE_MAX'] : ''}
                onChange={(event) => {
                  const temp = structuredClone(att);
                  temp.PRICE_MAX = event?.target.value;
                  setAtt(temp);
                }}
              />
            </Grid>
            {renderFilters()}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('Cancel')}</Button>
          <Button onClick={handleApply}>{t('Apply')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}