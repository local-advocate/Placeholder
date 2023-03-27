import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';

export default function LanguageChanger() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [lang, setLang] = React.useState('');
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (router.locale) {
      setLang(router.locale);
    }
  }, [router.locale]);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleChange = (event: SelectChangeEvent) => {
    router.push('/', '/', { locale: event.target.value });
  };

  return (
    <Box textAlign={'end'}>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>{t('language.Language')}</InputLabel>
        <Select
          value={lang}
          defaultValue={lang}
          onChange={handleChange}
          autoWidth
          label="Language"
          onOpen={handleOpen}
          onClose={handleClose}
          sx={{textAlign: 'start'}}
        >
          <MenuItem value={'en'}>{t('language.English')}{(open && router.locale) === 'en' ? '(Current)' : ''}</MenuItem>
          <MenuItem value={'fr'}>{t('language.French')}{(open && router.locale) === 'fr' ? '(Current)' : ''}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}