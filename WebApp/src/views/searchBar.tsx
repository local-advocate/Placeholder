import { useEffect, useState, useContext } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { GraphQLClient, gql } from 'graphql-request';
import TextField from '@mui/material/TextField';
import AccountIcon from './AccountIcon';
import { SearchContext } from './context';
import { Product } from '../graphql/product/schema';
import { Autocomplete, ListItem } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

// https://mui.com/material-ui/react-app-bar/

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export default function SearchAppBar() {
  const { t } = useTranslation('common');
  const ctx = useContext(SearchContext);
  const router = useRouter();
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useState(undefined);
  const [queryStr, setQueryStr] = useState('');
  
  useEffect(() => {
    const item = localStorage.getItem('user');
    try{
      if(item) {setUser(JSON.parse(item));}
    } catch {
      setUser(undefined)
    }
  }, []);

  useEffect(() => {
    setResults([]);
    const fetchData = async () => {
      const f = {
        q: input
      }
      const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {
      })
      const query = gql`
        query productsFiltered ($filters: String!) {
          productsFiltered(filters:$filters) {
            id, seller, price, name, mainImage
          }
        }
      `
      const filters = JSON.stringify(f);
      const variables = {filters};
      const data = await graphQLClient.request(query, variables);
      setResults(data.productsFiltered);
    }

    if (input != '') {
      fetchData()
        .catch(() => {
          // console.log('error');
        })
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  useEffect(() => {
    if (router.isReady) {
      let url = router.asPath;
      if (url.indexOf('?') != -1) {
        url = url.slice(url.indexOf('?') + 1);
        if (router.query.q) {
          url = url.replace(`q=${encodeURIComponent(router.query.q as string)}`, '');
        }
        if (url[0] === '&') {
          url = url.slice(url.indexOf('&') + 1);
        }
        setQueryStr(url);
      }
    }
  }, [router.asPath, router.isReady, router.query.q]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
            onClick = {() => router.push('/')}
          >
            {t('title')}
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon></SearchIcon>
            </SearchIconWrapper>
          </Search>
          {/* https://stackoverflow.com/questions/67124239/material-ui-how-to-show-autocomplete-dropdown-list-only-when-typing-something */}
          <Autocomplete
            sx={{width: '30%', marginLeft: '2%'}}
            freeSolo
            filterOptions={(x) => x}
            getOptionLabel={(option) => {
              if (typeof option !== 'string' && option.name) {
                return option.name;
              } else {
                return '';
              }
            }}
            options={results.map((options) => options)}
            renderOption={(props, option) => (
              <ListItem {...props} key={option.id}>
                {option.name}
              </ListItem>
            )}
            inputValue={input}
            onInputChange={(event, value) => {
              setInput(value);
              if (value == '') {
                setOpen(false);
              } else {
                setOpen(true);
              }
            }}
            onChange={(event, value) => {
              setOpen(false);
              if (value) {
                let query = '';
                if (typeof value !== 'string' && value.name) {
                  query = `q=${value.name}`;
                } else {
                  query = `q=${value}`;
                }
                if (queryStr != '') {
                  query += '&' + queryStr;
                }

                console.log(query);

                if(ctx?.currSubcategory) {
                  router.push({
                    pathname: `/explore/category/${ctx?.currCategory}/${ctx?.currSubcategory}`,
                    query: query
                  });
                } else if (ctx?.currCategory) {
                  router.push({
                    pathname: `/explore/category/${ctx?.currCategory}`,
                    query: query
                  });
                } else {
                  router.push({
                    pathname: `/search`,
                    query: query
                  })
                }
              }
            }}
            onClose={() => {
              setOpen(false);
            }}
            open={open}
            renderInput={(params) => 
              <TextField {...params} label={t('Search') + "..."} />}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex'}}>
            {!user ?
              <div>
                <Button sx = {{mr: '10px'}} color="inherit" variant="outlined" onClick={() => router.push('/login')}>{t('Login')}</Button>
                <Button color="inherit" variant="outlined" onClick={() => router.push('/signup')}>{t('Signup')}</Button>
              </div>:
              <div style={{display: 'flex'}}>
                <Button sx = {{mr: '10px'}} color="inherit" variant = "outlined" onClick={() => router.push({pathname: '/chat'})}>{t('Chats')}</Button>
                <Button sx = {{mr: '10px'}} color="inherit" variant = "outlined" onClick={() => router.push({pathname: '/selling'})}>{t('Selling')}</Button>
                <Button sx = {{mr: '10px'}} color="inherit" variant = "outlined" onClick={() => router.push({pathname: '/sell'})}>{t('Sell')}</Button>
                <AccountIcon aria-label="account"/>
              </div>
            }
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}