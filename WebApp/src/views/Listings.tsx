import {useState, useEffect } from 'react';
import { Product } from '@/graphql/product/schema';
import Router from 'next/router';
import {Card, CardActions, CardContent, CardMedia,
  Typography, IconButton} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MessageIcon from '@mui/icons-material/Message';
import Link from 'next/link';
import { hex_to_ascii } from './productView';
import { useTranslation } from 'next-i18next';
import DeleteDialog from './DeleteDialog';
import { ProductContext } from './context';
// import { GraphQLClient, gql } from 'graphql-request';

const cardSize = 300;
const cardMediaSize = cardSize*0.5

export default function Listings() {
  const { t } = useTranslation('common');
  const [products, setProducts] = useState<Product[]|undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [productDelete, setDelete] = useState<boolean>(false);

  useEffect(() => {
    const query = {query: `{getOwnProducts {
      id, seller, price, name, mainImage
      }}`}

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string): undefined;
    if(!user || !user.accessToken) {
      Router.push('/login?from=/selling');
    }
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ((user && user.accessToken) ? user.accessToken : '')
      },
    }).then((res) => {
      console.log(res);
      return res.json();
    })
      .then((json) => {
        if(json.errors) {
          console.log(json);
          setProducts(undefined);
        } else {
          setProducts(json.data.getOwnProducts);
        }
        setLoading(false);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDelete]);

  const handleDelete= () => {
    setDelete(!productDelete);
  }

  return (
    <>
      <div>
        <Typography variant="h6" sx={{pb: '15px', fontWeight: 'bold'}} noWrap component="div">
          {t('Listings')}
        </Typography>
        <>{products ? (products.length === 0 ?
          <div>
            <div>{t('No Listing')}</div>
          </div>:
          <div className='listings'>
            {products.map((product) => (
              <Card key={product.id} sx={{ maxWidth: cardSize, maxHeight: cardSize}}>
                <Link href={`/item/detail/${product.id}`} style={{ textDecoration: 'none', color:'none' }}>
                  <CardMedia
                    component='img'
                    sx={{ height: cardMediaSize }}
                    // src={`data:image/png;base64,${products[curr].mainImage}`} 
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
                    <Typography variant="body2" color="text.secondary">
                        By *User*. At *Location*
                    </Typography>
                  </CardContent>
                </Link>
                <CardActions>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="message">
                    <MessageIcon />
                  </IconButton>
                  <ProductContext.Provider value={{productDelete: productDelete, setDelete: handleDelete}}>
                    <IconButton aria-label={"delete_" + product.id}>
                      <DeleteDialog name={product.name} id={product.id}/>
                    </IconButton>
                  </ProductContext.Provider>
                </CardActions>
              </Card>
            ))}
          </div>)
          : loading ? '': Error}</>
      </div>
    </>
  )
}