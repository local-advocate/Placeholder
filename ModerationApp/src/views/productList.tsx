import {useState, useEffect} from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import * as React from 'react';
import {Card, CardActions, CardContent,
  Typography, CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import { Product } from '../graphql/product/schema';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const cardSize = 300;

const deleteListing = async (id: string|undefined, setLoading: (loading: boolean) => void) => {
  const item = localStorage.getItem('user')
  const user = item ? JSON.parse(item): undefined
  const bearerToken = user ? user.accessToken : ''
  const graphQLClient = new GraphQLClient('http://localhost:3002/api/graphql', {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  const query = gql`
    mutation deleteListing($id: String!) {
      deleteListing(id: $id)
    }
  `
  const variables = {
    id: id,
  }

  await graphQLClient.request(query, variables);
  setLoading(true);
}

const approveProduct = async (id: string|undefined, setLoading: (loading: boolean) => void) => {
  const item = localStorage.getItem('user')
  const user = item ? JSON.parse(item): undefined
  const bearerToken = user ? user.accessToken : ''
  const graphQLClient = new GraphQLClient('http://localhost:3002/api/graphql', {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  const query = gql`
    mutation approveProduct($id: String!) {
      approveProduct(id: $id)
    }
  `
  const variables = {
    id: id,
  }

  await graphQLClient.request(query, variables);
  setLoading(true);
}

const updateProduct = async (product: Product, setLoading: (loading: boolean) => void, setProduct: (product: Product|undefined) => void,
  setDisplay: (display: string) => void, name: string, description: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {seller, reason, ...rest} = product;
  console.log(product);
  const newprod = {
    id: product.id,
    name: name ? name : product.name,
    description: description ? description : product.description,
  }
  console.log(newprod);
  const item = localStorage.getItem('user')
  const user = item ? JSON.parse(item): undefined
  const bearerToken = user ? user.accessToken : ''
  const graphQLClient = new GraphQLClient('http://localhost:3002/api/graphql', {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  const query = gql`
    mutation updateProduct($product: ProductInput!) {
      updateProduct(input: $product)
    }
  `
  const variables = {
    product: newprod,
  }

  await graphQLClient.request(query, variables);
  setProduct(undefined);
  setDisplay('none');
  setLoading(true);
}

// https://github.com/mui/material-ui/blob/v5.11.12/docs/data/material/components/text-fields/FormPropsTextFields.tsx
export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product>();
  const [display, setDisplay] = useState('none');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetch = (async () => {
      const item = localStorage.getItem('user')
      const user = item ? JSON.parse(item): undefined
      const bearerToken = user ? user.accessToken : ''
      const graphQLClient = new GraphQLClient('http://localhost:3002/api/graphql',  {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
      const query = gql`
        query getFlaggedProducts { getFlaggedProducts {
            id, seller, price, name, description, reason, attributes
        }}
      `
      const data = await graphQLClient.request(query);
      setProducts(data.getFlaggedProducts);
    });

    fetch()
      .catch(console.error);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    loading ? <CircularProgress/> :
      <>
        <Grid container justifyContent='center' >
          <Typography variant="h4" sx={{mt: "50px", mb: "50px"}}>
            Flagged Listings
          </Typography>
        </Grid>
        <div className='listViewGrid'>     
          {products.map((product) => (
            <Card key={product.id} sx={{ maxWidth: cardSize}}>
              <Link href={`/item/detail/${product.id}`} style={{ textDecoration: 'none', color:'none' }}>
                <CardContent style={{padding: 0, paddingLeft: 7}}>
                  <Typography variant="h6" component="div" color="text.primary">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    User id: {product.id}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    Description: {product.description}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    Reason: {product.reason}
                  </Typography>
                </CardContent>
              </Link>
              <CardActions>
                <Button aria-label={`edit product ${product.id}`} variant="contained" onClick={() => {
                  setProduct(product);
                  setDisplay('initial');
                  setLoading(true);
                  console.log(product);
                }}>
                Edit
                </Button>
                <Button aria-label={`approve product ${product.id}`} variant="contained" onClick={()=>{
                  setProduct(undefined);
                  setDisplay('none');
                  approveProduct(product.id, setLoading);
                }}>
                Approve
                </Button>
                <Button aria-label={`delete product ${product.id}`} variant="contained" onClick={()=>{
                  setProduct(undefined);
                  setDisplay('none');
                  deleteListing(product.id, setLoading);
                }}>
                Deny
                </Button>
              </CardActions>      
            </Card>
          ))}
        </div>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            display: display
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              required
              id="Product name"
              label="Product name"
              defaultValue={product ? product.name : undefined}
              //eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange = {(event: any) => {
                setName(event?.target.value)
              }}
            />
            <TextField
              required
              id="Product description"
              label="Product description"
              defaultValue={product ? product.description : undefined}
              //eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange = {(event: any) => {
                setDescription(event?.target.value)
              }}
            />
          </div>
          <Button aria-label={`submit product`} variant="outlined" onClick={() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            updateProduct(product, setLoading, setProduct, setDisplay, name, description);
          }}>
          Submit
          </Button>
        </Box>
      </>
  );
}