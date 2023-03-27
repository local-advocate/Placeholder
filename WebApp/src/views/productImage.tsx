import { Grid } from "@mui/material";

interface Props{
    src: string,
    width?: string,
}

export default function ProductImage(props: Props){
  return(
    <Grid item xs = {12}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src = {props.src} width = {props.width}/>
    </Grid>
  )
}