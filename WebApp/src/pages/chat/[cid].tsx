import { Box, CssBaseline, Typography, Paper} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { GraphQLClient, gql } from 'graphql-request'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import MessageBox from '../../views/messageBox';
import MessageBar from '../../views/messageAppBar';
import Router from 'next/router'
import {Messages} from '../../graphql/message/schema';
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

export default function Message() {
  const router = useRouter()
  const { cid } = router.query
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState('')

  useEffect(() => {
    if(router.isReady) {
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
            query messages ($conversation_id: String!) {
              messages(conversation_id: $conversation_id) {
                id, time, message, sender
              }
            }
          `
        const variables = {conversation_id: cid};
        const data = await graphQLClient.request(query, variables);
        setUid(JSON.parse(atob(bearerToken.split('.')[1])).id);
        setMessages(data.messages);
        setLoading(false);
      });
      fetch()
        .catch(() => {
          console.error;
          Router.push(`/login?from=/chat/${cid}`);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height:'100vh'
      }}>
        {/* App Bar */}
        <MessageBar />
        {/* Messages */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          width:'100%', 
          maxHeight:'65%', overflowY: 'scroll',
          ml: 1
        }}>
          {loading ? <CircularProgress/> : (
            messages.map((message: Messages) => (
              <Paper variant='elevation' key={message.time} sx={{
                m:2, mb:0, maxWidth: '70%',
                alignSelf: message.sender===uid?'flex-start':'flex-end',
                background: message.sender===uid?'#e8e7e6':'#dbd3db'
              }}>
                <Typography variant='body2'>{message.message}</Typography>
                <Typography variant='caption'>{new Date(message.time).toLocaleString('en-US', { weekday:'long', month:'numeric', day:'numeric', hour:'numeric', minute:'numeric'})}</Typography>
              </Paper>
            ))
          )}
        </Box>
        {/* Message Box */}
        {/* //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore */}
        <MessageBox id={cid}/>
      </Box>
    </>
  )
}
