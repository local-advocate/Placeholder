import { Box, CssBaseline, Typography, Divider,
  List, ListItem, ListItemText, ListItemAvatar,
} from '@mui/material';
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { GraphQLClient, gql } from 'graphql-request'
import { useState, useEffect, useContext } from 'react';
import { SelectionContext } from './chatContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Router from 'next/router'
import { Preview } from '@/graphql/message/schema';
import { useTranslation } from 'next-i18next';

export default function Conversations() {

  const { t } = useTranslation('common');
  const ctx = useContext(SelectionContext);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // get previews
    const fetch = (async () => {
      const item = localStorage.getItem('user')
      const user = item ? JSON.parse(item): undefined;
      const bearerToken = user ? user.accessToken : ''
      const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
      const query = gql`
            query conversations {
              conversations {
                sent {message{message} name cid}
                received {message{message} name cid}
              }
            }
          ` 
      const data = await graphQLClient.request(query);
      setPreviews(ctx?.selection==='Created'?data.conversations.sent:data.conversations.received);
      setLoading(false);
    });
  
    fetch()
      .catch(() => {
        console.error;
        Router.push(`/login?from=/chat`);
      });
  }, [ctx?.selection]);

  const launch = (cid: string, name: string) => {
    localStorage.setItem('name', name)
    Router.push(`/chat/${cid}`);
  }

  return (
    <>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '80%',
        ml: 1
      }}>
        {loading ? <CircularProgress/> : (
          previews.length === 0 ? <i>{t(`You have no '${ctx?.selection}' conversations...`)}</i>:
            <List sx={{width: '100%'}}>
              {previews.map((p: Preview) => (
                <>
                  <ListItem
                    key={p.cid}
                    id={p.cid}
                    onClick={()=>launch(p.cid, p.name)}
                    alignItems='flex-start'
                    sx={{
                      width: '100%',
                      '&:hover': {
                        background: "#faf7fa",
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <AccountCircleIcon />
                    </ListItemAvatar>
                    <ListItemText primary={p.name} secondary={
                      <Typography noWrap sx={{fontSize:'1.6ex'}}>
                        {p.message.message}
                      </Typography>
                    }/>
                  </ListItem>
                  <Divider flexItem />
                </>
              ))}
            </List>
        )}
      </Box>
    </>
  )
}