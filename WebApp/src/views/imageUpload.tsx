import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useTranslation } from "next-i18next";

interface Props{
    addImage: (src: string) => void;
}

export default function ImageUploader(props: Props){
  const { t } = useTranslation('common')
  const [imageData, setImageData] = useState("");
  const [imageName, setImageName] = useState("");
  let fileReader: FileReader;
  const handleRead = () => {
    setImageData(fileReader.result as string);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = (event: any): void => {
    if(event.target.files.length >= 0){
      fileReader = new FileReader();
      fileReader.onloadend = handleRead
      fileReader.readAsDataURL(event.target.files[0])
      setImageName(event.target.files[0].name)
    }
  }

  const addToListing = () => {
    props.addImage(imageData)
    setImageData("")
    setImageName("")
    console.log("Got Image")
  }

  return(
    <Grid item xs = {6}>
      <Paper sx = {{
        padding: '10px',
      }}>
        <Typography variant = 'h6'>
          {t('Upload Listing Image')}
        </Typography>
        <hr/>
        <Box>
          <Typography variant = 'subtitle1'>
            {imageName}
          </Typography>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {imageData !== "" ? <img alt="Alt" aria-label = 'preview' src = {imageData}/> : null}
        </Box>
        <Button variant="contained" component="label">
          {t('Select Image')}
          <input onChange = {handleUpload} hidden accept="image/*" multiple type="file" />
        </Button>
        <Button variant="contained" component="label" onClick={addToListing} disabled = {imageData == ""}>
          {t('Add Image To Listing')}
        </Button>
      </Paper>
    </Grid>
  )
}