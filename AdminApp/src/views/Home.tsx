import Categories from './Categories';
import router from 'next/router';
import AppBar from './AppBar';
import { Button, Box } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function Home() {
  return (
    <>
      <AppBar/>
      <Box sx={{pl: '10px'}}>
        <Typography variant="h5" sx={{fontWeight: 'bold'}}>Categories</Typography>
        <Categories/>
        <Button variant="contained" onClick={() => router.push({
          pathname: '/add/category/'
        })}>Create</Button>
      </Box>
    </>
  );
}