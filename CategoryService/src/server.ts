import dotenv from 'dotenv';
dotenv.config();

import app from './app';

app.listen(3012, () => {
  console.log(`Category MicroServer Running on port 3012`);
  console.log('API Testing UI: http://localhost:3012/api/v0/docs/');
});