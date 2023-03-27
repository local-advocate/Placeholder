import { Subcategory, Category } from "@/graphql/category/schema";
import { Delete } from "@mui/icons-material";
import { Button, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { gql, GraphQLClient } from "graphql-request";
import { useTranslation } from "next-i18next";
import Router from 'next/router'
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Categories from "./Categories";
import Header from "./header";
import ImageUploader from "./imageUpload";
import SearchAppBar from "./searchBar";

export default function ListingCreation() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [images, setImages] = useState<string[]>([])
  const [price, setPrice] = useState(0)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState<{[key: string]: Subcategory[]}>({})
  const [catAttributes, setCatAttributes] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [attributes, setAttributes] = useState<{[key: string]: any}>({})
    
  useEffect(() => {
    const fetch = (async () => {
      const graphQLClient = new GraphQLClient('http://localhost:3000/api/graphql', {})
      const query = gql`
        query categories {
          categories {
            category{id, name},
            subcategories{id, name, attributes}
          }
        }
      `
      const data = await graphQLClient.request(query);
      const temp = []
      const subTemp: {[key: string]: Subcategory[]} = {}
      for(const c of data.categories){
        temp.push(c.category)
        for(const sub of c.subcategories){
          console.log(sub, sub.attributes)
          sub.attributes = JSON.parse(sub.attributes);
        }
        subTemp[`"${c.category.id}"`] = c.subcategories
      }
      console.log(subTemp)
      setSubCategories(subTemp)
      setCategories(temp)
    });

    fetch()
      .catch(console.error);
  }, [])
  
  const addAttribute = (key: string, value: string | number) => {
    const old: {[key: string]: string|number} = Object.assign({}, attributes)
    old[key] = value;
    setAttributes(old);
  }

  const createListing = () => {
    if(localStorage.getItem('user') == null){
      Router.push({
        pathname: '/login'
      })
      return
    }
    const user = JSON.parse(localStorage.getItem('user') as string)
    const query = {query: `mutation createProduct{createProduct(input: {
        price: ${price}
        name: "${title}"
        category: "${category}"
        subcategory: "${subcategory}"
        description: """${description}"""
        attributes: """${JSON.stringify(attributes)}"""
    }) {
            id, seller, name, price
        }}`}
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.accessToken
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.errors) {
          console.log(json.errors)
          alert('Error creating listing');
        } else {
          console.log("Listing Created");
          const productID = json.data.createProduct.id
          for(let i = 0; i<images.length; i++){
            uploadImage(images[i], productID, i)
          }
          Router.push(
            `/item/detail/${productID}`
          )
        }
      })
  }

  const addImage = (newImg: string) => {
    setImages([...images, newImg])
    console.log(images);
  }

  const removeImage = (index: number) => {
    const newImages = images.slice()
    newImages.splice(index,1)
    setImages(newImages)
  }

  const uploadImage = (imageData: string, product: string, index: number) => {
    const user = JSON.parse(localStorage.getItem('user') as string)
    console.log(product, index)
    const query = {query: `mutation uploadImage{uploadImage(data: "${imageData}", product: "${product}", order: ${index})}`}
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
        'authorization': user.accessToken
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.errors) {
          console.log(json.errors)
          alert('Error uploading Image');
        } else {
          console.log("Got Image");
          console.log(json.data.uploadImage)
        }
      })
  }
  
  return (
    <>
      <Header/>
      <SearchAppBar/>
      <Categories/>
      <Paper>
        <Grid container padding='10px' spacing='10px'>
          <Grid item xs = {12}>
            <Typography 
              variant = 'h6'>
              {t('Listing Title')}
            </Typography>
            <TextField 
              required = {true}
              value = {title} 
              //eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange = {(event: any) => {
                setTitle(event?.target.value)
              }}
              label = "Title"
              aria-label="Title Input"/>
          </Grid>
          <Grid item xs = {12} sm = {6}>
            <Typography variant = 'h6'>
              {t('Listing Description')}
            </Typography>
            <TextField 
              required = {true}
              fullWidth
              multiline 
              rows={5}
              value = {description} 
              //eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange = {(event: any) => {
                setDescription(event?.target.value)
              }}
              label = "Description"
              aria-label="Description Input"/>
          </Grid>
          <Grid item xs = {12}>
            <Typography 
              variant = 'h6'>
              {t('Price')}
            </Typography>
            <TextField 
              required = {true}
              value = {price} 
              type = 'number'
              //eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange = {(event: any) => {
                setPrice(event?.target.value)
              }}
              label = ""
              aria-label="Price Input"/>
          </Grid>
          <Grid item xs = {12}>
            <InputLabel id="demo-simple-select-label">{t('Category')}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Category"
              onChange={(event) => {
                setCategory(event.target.value)
                setAttributes({})
                setSubCategory("")
              }}
            >
              {categories.map((cat) => {
                return <MenuItem key={cat.id} value={cat.id}>{t('category.' + cat.name)}</MenuItem>
              })}
            </Select>
            {category != "" ? 
              <InputLabel id="demo-simple-select-label">{t('Sub Category')}</InputLabel>
              : null}
            {category != "" ? 
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={subcategory}
                aria-label = "SubCategory"
                label="SubCategory"
                onChange={(event) => {
                  setSubCategory(event.target.value)
                  console.log(attributes);
                  setAttributes({})
                  subCategories[`"${category}"`].map((cat) => {
                    if(cat.id === event.target.value){
                      setCatAttributes({});
                      setTimeout(() => {setCatAttributes(cat.attributes)}, 50)
                    }
                  })
                }}
              >
                {subCategories[`"${category}"`].map((cat) => {
                  return <MenuItem key={cat.id} value={cat.id}>{t('sub.' + cat.name)}</MenuItem>
                })}
              </Select> : null
            }
            {subcategory != "" ?
              <InputLabel id="demo-simple-select-label">{t('Attributes')}</InputLabel> 
              : null
            }
            {subcategory != "" ?
              <Grid>
                {Object.keys(catAttributes).map((key) => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  const attr = catAttributes[key]
                  console.log(typeof(attr));
                  if(typeof(attr) == "object"){
                    return <Grid key={key}>
                      <InputLabel>{t(key.charAt(0).toUpperCase() + key.slice(1))}</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={attributes[key]}
                        aria-label = {key}
                        label={key}
                        onChange={(event) => {
                          addAttribute(key, event.target.value)
                        }}
                      >
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {attr.map((option: any) => {
                          return <MenuItem key={option} value={option}>{option}</MenuItem>
                        })}
                      </Select>
                    </Grid>
                  } else if (typeof(attr) == 'number'){
                    return <Grid key={key}>
                      <InputLabel>{t(key.charAt(0).toUpperCase() + key.slice(1))}</InputLabel>
                      <TextField 
                        required = {true}
                        value = {attributes[key]} 
                        type = 'number'
                        //eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange = {(event: any) => {
                          attributes[key] = event.target.value
                        }}
                        label = ""
                        aria-label={key}/>
                    </Grid>
                  }
                })}
              </Grid> : null
            }
          </Grid>
          <Grid container spacing = '5px'>
            {
              images.map((img, index) => {
                return(
                  <Grid key = {index} item xs = {4}>
                    <Box sx = {{
                      backgroundImage: `url(${img})`,
                      width: '100%',
                      height: '300px',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                    }}>
                      <IconButton 
                        aria-label = 'Delete'
                        onClick = {() => {
                          removeImage(index)
                        }}>
                        <Delete
                          sx = {{
                            backgroundColor: 'white',
                            borderRadius: '10%',
                          }}/>
                      </IconButton>
                    </Box>
                  </Grid>
                )
                
              })}
          </Grid>
          <Grid item xs = {12}>
            <ImageUploader addImage = {addImage}/>
          </Grid>
          <Button variant = 'contained' 
            disabled = {title === '' || description === '' || subcategory === '' || images.length === 0}
            onClick = {createListing}
            aria-label = "Create Listing"> 
            {t('Create Listing')}
          </Button>
          <Button href={"/" + router.locale} color={"warning"} variant = 'contained'>
            {t('Cancel')}
          </Button>
        </Grid>
      </Paper>
    </>
  );
}