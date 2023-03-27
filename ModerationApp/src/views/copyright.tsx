import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// Change Later
export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://google.com">
        Group 4
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
