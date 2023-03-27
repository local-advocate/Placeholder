import { Box, CssBaseline, AppBar, Typography, Toolbar, Button,
  List, ListItem, ListItemText
} from '@mui/material';
import React from 'react';
import { useState, useEffect } from 'react';
import { SelectionContext } from '../../views/chatContext';
import Router from 'next/router'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AccountIcon from '../../views/AccountIcon';
import IconButton from '@mui/material/IconButton';
import Conversations from '../../views/conversations';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'common',
      ])),
    },
  };
};

export default function Index() {
  const { t } = useTranslation('common');
  const selections = ['Created', 'Received']
  const [selection, setSelection] = useState(selections[0])

  useEffect(() => {
    if (!localStorage.getItem('user') || localStorage.getItem('user') == null) {
      Router.push({
        pathname: '/login'
      })
    }
  })

  return (
    <SelectionContext.Provider value={{
      selection: selection, setSelection: setSelection,
    }}>
      {/* App Bar */}
      <AppBar position='static' sx={{background: '#ab85ab'}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            id="backArrow"
            aria-label="backArrow"
            sx={{ mr: 1 }}
            onClick={()=>Router.push('/')}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('Conversations')}
          </Typography>
          <Button color="inherit" id='companyLogo' onClick={()=>Router.push('/')}>{t('title')}</Button>
          <AccountIcon />
        </Toolbar>
      </AppBar>
      {/* Main Box */}
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
      }}>
        {/* Side Bar */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          width:'20%',
          maxWidth: '180px',
          height: '100vh',
          background: '#faf7fa',
        }}>
          <List dense={true}>
            {selections.map((s) => (
              <ListItem
                key={s}
                onClick={()=>setSelection(s)}
                sx={{'&:hover': {background: "#fff"}, background: selection===s?'#dbd3db':'none'}}
              >
                <ListItemText primary={t(s)}/>
              </ListItem>
            ))}
          </List>
        </Box>
        {/* Conversations */}
        <Conversations />
      </Box>
    </SelectionContext.Provider>
  )
}
