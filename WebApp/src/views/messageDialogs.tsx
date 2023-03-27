import * as React from 'react';
import { Button, Box, TextField, IconButton, Snackbar,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { GraphQLClient, gql } from 'graphql-request';
import Router from 'next/router';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export interface MessageDialogProps {
  open: boolean;
  dialogContentText: string;
  onClose: () => void;
  title: string;
  buttonOneText: string;
  buttonTwoText: string;
  buttonOneFunc: () => void;
  buttonTwoFunc: () => void;
}

function MessageDialog(props: MessageDialogProps) {
  const { onClose, open, dialogContentText, title,
    buttonOneFunc, buttonTwoFunc, buttonOneText, buttonTwoText } = props;

  return (
    <Dialog onClose={()=>onClose()} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {dialogContentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>buttonOneFunc()}>{buttonOneText}</Button>
        <Button onClick={()=>buttonTwoFunc()}>{buttonTwoText}</Button>
      </DialogActions>
    </Dialog>
  );
}

interface CanMessageDialogProps {
  open: boolean;
  setCanMsg: (value: boolean) => void;
  from: string;
}

export function CanMessageDialog(props: CanMessageDialogProps) {
  const { t } = useTranslation('common')
  const { setCanMsg, open, from} = props;

  return (
    <MessageDialog
      open={!open}
      onClose={()=>setCanMsg(true)}
      dialogContentText={t('Login or Signup to message the seller.')}
      buttonOneText={t('Login')}
      buttonOneFunc={()=>{setCanMsg(true);Router.push(`/login?from=${from}`)}}
      buttonTwoText={t('Signup')}
      buttonTwoFunc={()=>{setCanMsg(true);Router.push('/signup')}}
      title={t('title')}
    />
  );
}

const gquery = () => {
  const item = localStorage.getItem('user')
  const user = item ? JSON.parse(item): undefined
  const bearerToken = user ? user.accessToken : ''
  const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  })
  return graphQLClient
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function canMessage(setContactDialog, setCanMsg) {
  const gclient = gquery()
  try {
    const query = gql`
      query canMsg {
        canMessage {bool}
      }
    `
    await gclient.request(query);
    setContactDialog(true)
  } catch {
    setCanMsg(false)
  }
}

async function getConversation(gclient: GraphQLClient, seller: string)  {
  const query = gql`
  query conversation ($receiver: String!) {
    conversation (receiver: $receiver) { conversation_id }
  }
`
  const variables = {receiver: seller}
  const data = await gclient.request(query, variables);
  return data.conversation.conversation_id;
}

async function createConversation(gclient: GraphQLClient, seller: string) {
  const query = gql`
    mutation createConversation ($receiver: String!) {
      createConversation (receiver: $receiver) { conversation_id }
    }
    `
  const variables = {receiver: seller}
  const data = await gclient.request(query, variables);
  return data.createConversation.conversation_id;
}

async function getName(gclient: GraphQLClient, seller: string) {
  const query = gql`
      query getUser ($id: String!) {
        getUser (id: $id) { name }
      }
    `
  const variables = {id: seller}
  const data = await gclient.request(query, variables);
  return data.getUser.name;
}

export async function messageSeller(seller: string | undefined): Promise<string | undefined> {
  if (!seller || seller === '') return undefined
  const gclient = gquery()

  return new Promise((resolve) => {
    getConversation(gclient, seller)
      .then(async (cid) => {
        localStorage.setItem('name', await getName(gclient, seller))
        Router.push(`/chat/${cid}`)
        resolve(cid)
      })
      .catch(async () => {
        // create conversation
        createConversation(gclient, seller)
          .then(async (cid)=>{
            localStorage.setItem('name', await getName(gclient, seller))
            Router.push(`/chat/${cid}`)
            resolve(cid)
          })
          .catch(()=>{console.error; resolve(undefined)})
      }) 
  })
}

interface ContactSellerDialogProps {
  open: boolean;
  setContactDialog: (value: boolean) => void;
  seller: string;
  setSeller: (value: string) => void;
}

export function ContactSellerDialog(props: ContactSellerDialogProps) {
  const { t } = useTranslation('common')
  const { setContactDialog, open, seller, setSeller } = props;

  return (
    <MessageDialog
      open={open}
      onClose={()=>setContactDialog(false)}
      dialogContentText={t('Start a conversation with the seller?')}
      buttonOneText={t('Contact')}
      buttonOneFunc={()=>{messageSeller(seller);setContactDialog(false)}}
      buttonTwoText={t('Cancel')}
      buttonTwoFunc={()=>{setContactDialog(false);setSeller('')}}
      title={t('title')}
    />
  );
}

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
  link: string,
}

export function ShareDialog(props: ShareDialogProps) {
  const { t } = useTranslation('common')
  const { onClose, open, onClick, link } = props;

  return (
    <Dialog onClose={()=>onClose()} open={open}>
      <DialogTitle>{t('title')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('Share Listing')}
        </DialogContentText>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <TextField id="input-with-sx" disabled label={link} variant="standard" />
          <IconButton id='copytoclipboard' onClick={()=>{
            navigator.clipboard.writeText(`localhost:3000/item/detail/${link}`);
            onClick();
          }}>
            <ContentCopyIcon />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

interface SnackBarProps {
  open: boolean;
  onClose: () => void;
}

export function SnackBar(props: SnackBarProps) {
  const { onClose, open } = props;

  return (
    <Snackbar
      open={open}
      onClose={() => onClose()}
      autoHideDuration={2000}
      message="Copied to clipboard"
    />
  );
}