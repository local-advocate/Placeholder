import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import { GraphQLClient, gql } from 'graphql-request';
import { ProductContext } from './context';
import { useTranslation } from 'next-i18next';

// https://mui.com/material-ui/react-dialog/

interface Props {
  name: string
  id: string
}

export default function DeleteDialog({name, id}: Props) {
  const ctx = React.useContext(ProductContext);
  const { t } = useTranslation('common');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose= () => {
    setOpen(false);
  };

  const handleDelete= () => {
    setOpen(false);
    const fetch = (async () => {
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string): undefined;
      const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {
        headers: {
          Authorization: `Bearer ` + ((user && user.accessToken) ? user.accessToken : ''),
        },
      })
      const query = gql`
          mutation deleteProduct {
            deleteProduct(id: "${id}")
          }
        `
      await graphQLClient.request(query);
    });
    fetch()
      .then(() => {
        ctx?.setDelete();
      })
      .catch(() => {
        // console.log(err);
      })
  };

  return (
    <div>
      <DeleteIcon onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("Delete Listing")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('Delete Prompt') + ' ' + name + '?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>{t('Yes')}</Button>
          <Button onClick={handleClose} autoFocus>
            {t(' No')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}