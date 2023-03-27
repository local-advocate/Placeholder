import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Router from 'next/router';

// https://mui.com/material-ui/react-app-bar/

export default function SearchAppBar() {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const item = localStorage.getItem('user');
    setUser(item ? JSON.parse(item): undefined);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
            onClick = {() => Router.push('/')}
          >
            Moderator App
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex'}}>
            <Button color="inherit" variant="outlined" onClick={() => {
              localStorage.removeItem('user');
              setUser(undefined);
              Router.push('/login')
            }}>Logout</Button> 
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}