import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Router from 'next/router';
import { useTranslation } from 'next-i18next';

export default function GuidelinesButton() {
  const { t } = useTranslation('common');
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link color="inherit" onClick={() => Router.push('/guidelines')}>
        {t('Guidelines')}
      </Link>
    </Typography>
  );
}