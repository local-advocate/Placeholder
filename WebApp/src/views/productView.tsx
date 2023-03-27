// https://github.com/mui/material-ui/blob/v5.11.8/docs/data/material/components/grid/FullWidthGrid.tsx
// https://github.com/mui/material-ui/blob/v5.11.8/docs/data/material/components/pagination/PaginationControlled.tsx
import {  useState, useEffect } from "react";
import { GraphQLClient, gql } from 'graphql-request'
import type { Product } from '../graphql/product/schema'
import type { CategoryDetail } from "../graphql/category/schema";
import type { UserInfo } from "../graphql/user/schema";
import * as React from 'react';
import { Box, Chip, Paper, Typography, Button, Pagination, Grid } from "@mui/material";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useTranslation } from "next-i18next";
import {canMessage, CanMessageDialog, ContactSellerDialog} from './messageDialogs';

interface ProductsProps{
  product: Product;
}

const fetchCategory = async (id: string|undefined, setCategoryDetail: (categoryDetail: CategoryDetail|undefined) => void) => {
  const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql');

  const query = gql`
    query subcategoryDetails($id: String!) {
      subcategoryDetails(id: $id) {
        category{id,name}, subcategory{id,name,attributes}
      }
    }
  `
  const variables = {
    id: id,
  }

  const data = await graphQLClient.request(query, variables);
  setCategoryDetail(data.subcategoryDetails);
}

const fetchSeller = async (id: string|undefined, setUserInfo: (userInfo: UserInfo|undefined) => void) => {
  const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql');

  const query = gql`
    query getUser($id: String!) {
      getUser(id: $id) {
        id, name
      }
    }
  `
  const variables = {
    id: id,
  }

  const data = await graphQLClient.request(query, variables);
  setUserInfo(data.getUser);
}

export const hex_to_ascii = (str1: string) =>
{
  const hex  = str1.toString();
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

export default function ProductView( item : ProductsProps) {
  const { t } = useTranslation('common');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [product, setProduct] = useState<Product>(item.product);
  const [categoryDetail, setCategoryDetail] = useState<CategoryDetail>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [canMsg, setCanMsg] = useState(true);
  const [contactDialog, setContactDialog] = useState(false);
  const [page, setPage] = React.useState(1);

  const Attributes = () => {
    if(product.attributes === undefined){
      return
    }
    const attributes = JSON.parse(product.attributes)
    const chips: ReactJSXElement[] = []
    Object.keys(attributes).map((key: string) => {
      chips.push(<hr/>)
      chips.push(<Chip label = {`${t(key.charAt(0).toUpperCase() + key.slice(1))}: ${attributes[key] as string | number}`}/>)
    })
    return chips
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    product.subcategory ? fetchCategory(product.subcategory, setCategoryDetail) : undefined;
  }, [product.subcategory]);

  useEffect(() => {
    product.seller ? fetchSeller(product.seller, setUserInfo) : undefined;
  }, [product.seller]);

  return (
    
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container spacing={2}
        direction="row"
        justifyContent="flex-start"
      >
        <Grid item xs={8} >
          <Paper 
            sx={{
              height: '100%',      
            }}>
            <Box sx={{height: '80%', }}> 
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Box display="flex" justifyContent="center" sx={{                 
                  height: '100%',
                  bgcolor: 'lightgrey',
                }}> 
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {<img alt="" src = {hex_to_ascii(product.images[page-1])} height = '350px' width='100%'/>}
                </Box>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper 
            sx={{
              pb: '30%'
            }}>
            <Typography align='center' variant='h3' sx={{pt: '5%'}}>
              {product.name}
            </Typography>
            <Typography align='left' variant='h6' sx={{pl: '10%'}}>
            ${product.price} 
              {/* {product.condition ? product.condition : null} */}
            </Typography>
            <Typography align='left' variant='subtitle1' sx={{pl: '10%'}}>
              {t('category.' + categoryDetail?.category.name)} - {t('sub.' + categoryDetail?.subcategory.name)}
            </Typography>
            <Typography align='left' variant='subtitle1' sx={{pl: '10%'}}>
              {t('Seller')}: {userInfo?.name}
            </Typography>
            <Grid container justifyContent='center' >
              <Button variant='contained' sx={{mt: '5%'}} onClick={()=>canMessage(setContactDialog, setCanMsg)}>
                {t('Message Seller')}
              </Button>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={8} >
          <Grid container justifyContent="center" alignItems="flex-end" >
            <Pagination count={product.images.length} page={page} onChange={handleChange} />
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Paper 
            sx={{
              pb: '5%'
            }}>
            <Typography align='left' variant='h6' sx={{pt: '5%', pl: '10%', pr: '10%', wordBreak: 'break-word'}}>
              {t('Description')}:
            </Typography>
            <Typography align='left' variant='body1' sx={{ pl: '10%', pr: '10%', wordBreak: 'break-word', whiteSpace: 'pre-wrap'}}>
              {product.description ? product.description : null}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper 
            sx={{
              pb: '10%'
            }}>
            <Typography align='left' variant='h6' sx={{pt: '5%', pl: '10%', pr: '10%', wordBreak: 'break-word'}}>
              {t('General Information')}
            </Typography>
            {
              Attributes()
            }
          </Paper>
        </Grid>
      </Grid>
      <CanMessageDialog open={canMsg} setCanMsg={setCanMsg} from={`/item/detail/${product.id}`}/>
      <ContactSellerDialog 
        open={contactDialog} setContactDialog={setContactDialog}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        seller={product.seller} setSeller={()=>{}}
      />
    </Box>
  )
}