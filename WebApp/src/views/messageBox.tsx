import React from 'react';
import { GraphQLClient, gql } from 'graphql-request'
import { useState } from 'react';
import {
  IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from 'next-i18next';

interface Props {id: string}

// https://codesandbox.io/s/gu5h8d?file=/demo.tsx
export default function MessageBox(props: Props) {

  const { t } = useTranslation('common')
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message === '') return
    const postData = async () => {
      const item = localStorage.getItem('user')
      const user = item ? JSON.parse(item): undefined
      const bearerToken = user ? user.accessToken : ''
      const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })
      const query = gql`
        mutation createMessage($conversation_id: String!, $message: String!) {
          createMessage(conversation_id: $conversation_id, message: $message) {
            id
          }
        }
      `
      const variables = {conversation_id: props.id, message: message}
      await graphQLClient.request(query, variables);
    }
    postData()
      .catch(console.error);
    setMessage('');
  }

  return (
    <FormControl fullWidth sx={{ 
      mt: 1, ml:0, width: '100%', position: 'absolute', bottom: '0' }}>
      <InputLabel>{t('Post a message')}</InputLabel>
      <OutlinedInput
        multiline minRows={5} maxRows={5} id='sendMessageBox'
        onChange={(e)=>{setMessage(e.target.value.toString())}}
        value={message}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              id='sendMessageIcon'
              onClick={sendMessage}
              edge="end"
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}