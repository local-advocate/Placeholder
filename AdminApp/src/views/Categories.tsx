import { useEffect, useState } from "react";
import { GraphQLClient, gql } from "graphql-request";
import { CategoryList } from "../graphql/category/schema";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import * as React from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import { Typography } from "@mui/material";

export default function Categories() {
  const [categories, setCategories] = useState<CategoryList[]|undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState<boolean[]>([]);

  const handleClick = ((event: React.SyntheticEvent, i: number) => {
    console.log(open);
    const arr = JSON.parse(JSON.stringify(open));
    if(arr[i]) {
      arr[i] = !arr[i];
    }else {
      arr[i] = true;
    }
    setOpen(arr);
  });

  useEffect(() => {
    const fetch = (async () => {
      const graphQLClient = new GraphQLClient('http://localhost:3001/api/graphql', {})
      const query = gql`
        query categories {
          categories {
            category{id, name}, subcategories{id, name, attributes}
          }
        }
      `
      const data = await graphQLClient.request(query);
      setLoading(false);
      setCategories(data.categories);
    });

    fetch()
      .catch(console.error);
    fetch();
  }, []);
  return (
    <>
      <Box sx={{ width: '100%', maxWidth: 360}}>
        <nav aria-label="main mailbox folders">
          {loading === true ? <CircularProgress/>: ''}
          <List>
            {categories ? categories.map((ele, i) => (
              <div key={i}>
                <Divider/>
                <ListItemButton onClick={(e) => handleClick(e, i)}>
                  <ListItem disablePadding>
                    <Typography variant="h6">
                      <ListItemText primary={ele.category.name} disableTypography/>
                    </Typography>
                  </ListItem>
                  {open[i] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                  
                <Collapse in={open[i]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {ele.subcategories? ele.subcategories.map((ele2, i) => (
                      <div key={i}>
                        <Divider />
                        <ListItem disablePadding sx={{ pl: 4 }}>
                          <Typography>
                            <ListItemText sx={{fontWeight: 'bold'}} primary={ele2.name} disableTypography/>
                          </Typography>
                        </ListItem>
                        <div key={i} style={{ paddingLeft: '60px'}}>
                          {Object.keys(JSON.parse(ele2.attributes)).map((ele3, i2) => (
                            <div key={i2}><u style={{fontSize: '17px'}}>{ele3}</u>: {Array.isArray(JSON.parse(ele2.attributes)[ele3]) ?
                              JSON.parse(ele2.attributes)[ele3].map((e: string, i4: number) => (
                                <span key={i4}>{e}, </span>
                              ))
                              :"Number"}</div>
                          ))}
                        </div>
                      </div>
                    )): ''}
                  </List>
                </Collapse>
              </div>
            )
            ): ''}
          </List>
        </nav>
      </Box>
    </>
  );
}