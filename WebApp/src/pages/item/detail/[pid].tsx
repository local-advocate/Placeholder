import {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import { GraphQLClient, gql } from 'graphql-request';
import { Product } from '../../../graphql/product/schema';
import ProductView from "../../../views/productView";
import CircularProgress from '@mui/material/CircularProgress';
import Header from '../../../views/header';
import SearchAppBar from '../../../views/searchBar';
import Categories from '../../../views/Categories';
import GuidelinesButton from '../../../views/guidelinesButton';
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

export default function Item() {
  const router = useRouter()
  const { pid } = router.query
  const [product, setProduct] = useState<Product|undefined>(undefined);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if(router.isReady) {
      const fetch = (async () => {
        const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {})
        const query = gql`
            query product {
              product(id: "${pid}") {
                id, seller, price, name, mainImage, images, category, subcategory, description, sellername, attributes
              }
            }
          `
        try {
          const data = await graphQLClient.request(query);
          setProduct(data.product);
        } 
        catch (error) {
          setProduct(undefined);
        }
        setLoading(false);
      });
      fetch()
        .catch(console.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <>
      <Header/>
      <SearchAppBar />
      <Categories/>
      {loading ? <CircularProgress/>
        : (product ? 
          <ProductView product={product}/>           
          : <div>Product does not exist</div>)      
      }
      <GuidelinesButton/>
    </>
  );
  
}
