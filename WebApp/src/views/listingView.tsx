import {useState, useEffect} from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import * as React from 'react';
import { Typography, CircularProgress, IconButton,
  Card, CardActions, CardContent, CardMedia,
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import ShareIcon from '@mui/icons-material/Share';
import Link from 'next/link';
import { Product } from '../graphql/product/schema';
import { hex_to_ascii } from './productView';
import {canMessage, CanMessageDialog, ContactSellerDialog, ShareDialog, SnackBar} from './messageDialogs';

const cardSize = 300;
const cardMediaSize = cardSize*0.5

interface Props {
  filters: string
}

export default function ListingView({filters}: Props) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canMsg, setCanMsg] = useState(true);
  const [share, setShare] = useState(false);
  const [snack, setSnack] = useState(false);
  const [link, setLink] = useState('');
  const [seller, setSeller] = useState('');
  const [contactDialog, setContactDialog] = useState(false);

  useEffect(() => {
    const fetch = (async () => {
      setLoading(true)
      let query, data;
      const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {})

      // Filtered query
      if (filters !== '') {
        query = gql`
          query productsFiltered ($filters: String!) {
            productsFiltered(filters:$filters) {
              id, seller, price, name, mainImage
            }
          }
        `
        const variables = {filters};
        data = await graphQLClient.request(query, variables);
        setProducts(data.productsFiltered);
      }

      // Home Page
      else {
        query = gql`
          query products {
            products {
              id, seller, price, name, mainImage
            }
          }
        `
        data = await graphQLClient.request(query);
        setProducts(data.products);
      }
      setLoading(false);
    });

    fetch()
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    loading ? <CircularProgress/> :
      <div className='listViewGrid'>
        <CanMessageDialog open={canMsg} setCanMsg={setCanMsg} from={''}/>
        <ContactSellerDialog 
          open={contactDialog} setContactDialog={setContactDialog}
          seller={seller} setSeller={setSeller}
        />
        <ShareDialog 
          link={link} open={share} onClose={()=>setShare(false)}
          onClick={()=>setSnack(true)}
        />
        <SnackBar open={snack} onClose={()=>setSnack(false)} />
        
        {products.map((product: Product) => (
          <Card key={product.id} sx={{ maxWidth: cardSize, maxHeight: cardSize}}>
            <Link href={`/item/detail/${product.id}`} style={{ textDecoration: 'none', color:'none' }}>
              <CardMedia
                component='img'
                sx={{ height: cardMediaSize }}
                src={hex_to_ascii(product.mainImage)}
                title={product.name}
              />
              <CardContent style={{padding: 0, paddingLeft: 7}}>
                <Typography variant="h6" component="div" color="text.primary">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    ${product.price}
                </Typography>
              </CardContent>
            </Link>
            <CardActions>
              <IconButton id="messageIcon" title="Message Seller" aria-label="message" onClick={()=>{setSeller(product.seller);canMessage(setContactDialog, setCanMsg);}}>
                <MessageIcon />
              </IconButton>
              <IconButton id="shareIcon" title="Share" aria-label="share" onClick={()=>{setLink(`${product.id}`);setShare(true)}}>
                <ShareIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}

      </div>
  );
}