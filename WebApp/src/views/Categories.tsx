import {useEffect, useState} from 'react';
import React from 'react';
import { CategoryList } from '../graphql/category/schema';
import { GraphQLClient, gql } from 'graphql-request';
import Box from '@mui/material/Box';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

// https://www.w3schools.com/howto/howto_css_dropdown.asp
// https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{width: number, height: number}>({width: 0, height: 0});

  useEffect(() => {
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);

    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); 
  return windowSize;
}

export default function Categories() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [categories, setCategories] = useState<CategoryList[]|undefined>(undefined);
  const [items, setItems] = useState(0);
  const {width} = useWindowSize();
  const [queryStr, setQueryStr] = useState('');

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (router.isReady) {
      setQueryStr('');
      if (router.query.q) {
        setQueryStr(`q=${router.query.q}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath, router.isReady]);

  useEffect(() => {
    console.log(width);
    setItems(Math.floor(width/170));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  // const handleOpen = ((event: React.MouseEvent, i: number) => {
  //   const obj = {};
  //   obj[i] = true;
  //   setOpen(obj)
  // });

  // const handleClose = (() => {
  //   setOpen({});
  // });
  
  const handleClick = ((event: React.MouseEvent, category: string, subcategory?: string) => {
    if(subcategory) {
      if (queryStr !== '') {
        router.push({
          pathname: `/explore/category/${category}/${subcategory}`,
          query: queryStr,
        });
      } else {
        router.push(`/explore/category/${category}/${subcategory}`);
      }
    } else {
      if (queryStr !== '') {
        router.push({
          pathname: `/explore/category/${category}`,
          query: queryStr,
        });
      } else {
        router.push(`/explore/category/${category}`);
      }
    }
  });

  // return (
  //   <>
  //     <Box sx={{ display: 'flex', textAlign: 'center', width: '100%', position: 'relative'}}>
  //       {categories ? categories.map((ele, i) => {
  //         return (
  //           <div key={ele.category.id}>
  //             <div sx={{display: 'flex', flex: '2', width: '100%', position: 'absolute'}}>
  //               <ListItemButton
  //                 onMouseEnter={(eve)=> handleOpen(eve, i)}
  //                 onMouseLeave={(eve) => handleClose(eve, i)}
  //                 onClick = {(event)=>{handleClick(event, ele.category.id)}}
                  
  //               >
  //                 <ListItemText primary={ele.category.name}/>
  //                 {open[i] ? <ExpandLess /> : <ExpandMore />}
  //               </ListItemButton>
  //                 <Collapse
  //                   in={open[i]}
  //                   timeout="auto"
  //                   unmountOnExit
  //                   onMouseEnter={(eve)=>handleOpen(eve, i)}
  //                   onMouseLeave={(eve) => handleClose(eve, i)}
  //                   sx={{position: 'relative', backgroundColor: 'white', border: '1px black solid'}}
  //                 >
  //                   <List component="div" disablePadding>
  //                     {ele.subcategories ? ele.subcategories.map((sub) => {
  //                       return (
  //                         <ListItemButton key={ele.category.id + ' ' + sub.id} sx={{ pl: 4 }} onClick = {(event)=>{handleClick(event, ele.category.id, sub.id)}}> 
  //                           <ListItemText primary={sub.name} />
  //                         </ListItemButton>
  //                       );
  //                     }): ''}
  //                   </List>
  //                 </Collapse>
                
  //             </div>
  //           </ div>)}): ''}
  //     </Box>
  //     <List sx = {{pb: '15px'}}>
  //       <Divider component="li"/>
  //     </List>
  //   </>
  // );

  return (
    <>
      <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', width: '100%'}}>
        {categories ? categories.map((ele, i) => {
          if(i < items) {
            return (
              <div key={ele.category.id} className="dropdown">
                <ListItemButton className='classButton' key={i} sx={{ pl: 4 }} onClick = {(event)=>{handleClick(event, ele.category.id)}}> 
                  <ListItemText primary={t('category.' + ele.category.name)} />
                  <KeyboardArrowDownIcon/>
                </ListItemButton>
                <div className='dropdown-content'>
                  {ele.subcategories ? ele.subcategories.map((sub, j) => {
                    if(j < items) {
                      return (
                        <ListItemButton key={ele.category.id + ' ' + sub.id} sx={{ pl: 4}} onClick = {(event)=>{handleClick(event, ele.category.id, sub.id)}}> 
                          <ListItemText primary={t('sub.' + sub.name)} />
                        </ListItemButton>
                      );
                    }
                  }): ''}
                </div>
              </ div>)
          }
        }): ''}
        {categories ? categories.length > items ?
          <div key={'more'} className="dropdown">
            <ListItemButton key={'more'
            } sx={{ pl: 4, minWidth: '150px'}}> 
              <ListItemText primary='More' />
              <KeyboardArrowDownIcon/>
            </ListItemButton>
            <div className='dropdown-content'>
              {categories.map((sub, j) => {
                if(j >= items) {
                  return (
                    <ListItemButton key={sub.category.id} sx={{ pl: 4 }} onClick = {(event)=>{handleClick(event, sub.category.id)}}> 
                      <ListItemText primary={t('category.' + sub.category.name)} />
                    </ListItemButton>
                  );
                }
              })}
            </div>
          </div>:'':''
        }
      </Box>
    </>
  );
}