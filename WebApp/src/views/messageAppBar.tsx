import { AppBar, Toolbar, Button,Typography} from '@mui/material';
import React from 'react';
import { useState, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import IconButton from '@mui/material/IconButton';
import Router from 'next/router'
import { useTranslation } from 'next-i18next';

export default function MessageBar() {

  const { t } = useTranslation('common')
  const [name, setName] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('name')
    if(name) setName(name)
  }, [])

  return (
    <>
      <AppBar position='static' sx={{background: '#ab85ab'}}>
        <Toolbar>
          <IconButton
            size="large"
            id="IconButtonID"
            edge="start"
            color="inherit"
            aria-label="backArrow"
            sx={{ mr: 1 }}
            onClick={()=>Router.push('/chat')}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <AccountCircleIcon />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {name}
          </Typography>
          <Button id='companyButton' color="inherit" onClick={()=>Router.push('/')}>{t('title')}</Button>
        </Toolbar>
      </AppBar>
    </>
  )
}