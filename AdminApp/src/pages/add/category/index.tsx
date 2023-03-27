import React, {useState, useEffect} from 'react';
import { SelectChangeEvent } from "@mui/material";
import router from 'next/router';
import AppBar from '../../../views/AppBar';
import { Button, Box, TextField } from '@mui/material';  
import Header from '../../../views/header';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { SubcategoryInput } from '../../../graphql/category/schema';

export default function Index() {
  const [counter, setCounter] = useState(1);
  const [category, setCategory] = useState("");
  const [subcategories, setSubcategories] = useState<SubcategoryInput[]>([{name: "", attributes: []}]);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') as string);
    const attributes: string[] = [];
    const subcategoriesList = [];
    for(let i = 0; i < subcategories.length; i++) {
      subcategoriesList.push(`"${subcategories[i].name}"`);
      const obj:{[key: string]: number | string[]} = {};
      for(const j of subcategories[i].attributes) {
        if(j.name == '') {
          alert('Error creating category');
        }
        if(j.type == 'enum') {
          for(const ele of j.values) {
            if(ele == '') {
              alert('Error creating category');
            }
          }
          obj[j.name] = j.values;
        } else {
          obj[j.name] = 0;
        }
      }
      let newStr = JSON.stringify(obj);
      newStr = newStr.replace(/"/g, '\'');
      attributes.push(`"${newStr}"`);
    }
    // const obj = {name: category, subcategories: subcategoriesList, attributes: attributes};
    const query = {query: `mutation createCategory{createCategory(input: {name:"${category}", subcategories: [` + subcategoriesList + `], attributes: [` + attributes  + `]}){
      category{id, name}, subcategories{id, name}
    }}`}
    console.log(query);
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.accessToken,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(json);
        if (json.errors) {
          alert('Error creating category');
        } else {
          router.push({
            pathname: '/'
          })
        }
      })
  };

  useEffect(() => {
    const get = localStorage.getItem('user');
    if(get === null) {
      router.push({
        pathname: '/login'
      })
    }
  }, []);

  const handleChange = (event: React.SyntheticEvent, i=0) => {
    event.preventDefault();
    const {value, name} = event.target as HTMLButtonElement;
    if(name === 'category') {
      setCategory(value);
    } else {
      const newArray = JSON.parse(JSON.stringify(subcategories));
      newArray[i].name = value;
      setSubcategories(newArray);
      console.log(subcategories);
    }
  }

  const handleClick = (event: React.SyntheticEvent, i: number) => {
    event.preventDefault();
    const newArray = JSON.parse(JSON.stringify(subcategories));
    newArray.splice(i, 1);
    setSubcategories(newArray);
    setCounter(counter-1);
  }

  const handleAttribute = (event: React.SyntheticEvent, i: number, i2: number) => {
    const {value} = event.target as HTMLButtonElement;
    event.preventDefault();
    const newArray = JSON.parse(JSON.stringify(subcategories));
    newArray[i].attributes[i2].name = value;
    setSubcategories(newArray);
    console.log(subcategories);
  }

  const handleSelectChange = (event: SelectChangeEvent<string>, i: number, i2: number) => {
    const {value} = event.target as HTMLButtonElement;
    event.preventDefault();
    const newArray = JSON.parse(JSON.stringify(subcategories));
    newArray[i].attributes[i2].type = value;
    newArray[i].attributes[i2].values = [""];
    setSubcategories(newArray);
  }

  const handleEnumChange = (event: React.SyntheticEvent, i: number, i2: number, i3: number) => {
    const {value} = event.target as HTMLButtonElement;
    event.preventDefault();
    const newArray = JSON.parse(JSON.stringify(subcategories));
    newArray[i].attributes[i2].values[i3] = value;
    setSubcategories(newArray);
  }
  
  const handleAttributeDelete = (event: React.SyntheticEvent, i: number, i2: number) => {
    event.preventDefault();
    const newArray = JSON.parse(JSON.stringify(subcategories));
    newArray[i].attributes.splice(i2, 1);
    setSubcategories(newArray);
  }

  const handleOptionDelete = (event: React.SyntheticEvent, i: number, i2: number, i3: number) => {
    event.preventDefault();
    const newArray = JSON.parse(JSON.stringify(subcategories));
    newArray[i].attributes[i2].values.splice(i3, 1);
    setSubcategories(newArray);
  }

  return (
    <>
      <Header/>
      <AppBar/>
      <Box component="form" onSubmit={handleSubmit} noValidate 
        sx={{mt: 1, display: 'flex', flexDirection: 'column', p: '5px'}}>
        <TextField id="outlined-basic" label="Category Name" sx={{m: '7px', maxWidth: '300px'}} variant="outlined" name="category" onChange={(eve) => handleChange(eve)} autoFocus required/>
        {
          Array.from(Array(counter), (e, i) => (
            <div key={i}>
              <TextField id="outlined-basic" sx={{m: '7px'}} aria-label="Subcategory" label="Subcategory Name"name="subcategory" value={subcategories[i].name}
                onChange={(eve) => handleChange(eve, i)} required/>
              {counter > 1 ? <IconButton aria-label="delete" onClick={(e) => handleClick(e, i)}><DeleteIcon/></IconButton>: ''}
              {subcategories[i].attributes ? subcategories[i].attributes.map((ele, i2) => (
                <div key={i2}  style={{display: 'flex', alignItems: 'center', minWidth: '300px'}}>
                  <TextField id="outline-basic" sx={{m: '7px'}} aria-label="Attribute" label="Attribute Name" name="attribute" value={ele.name}
                    onChange={(eve) => handleAttribute(eve, i, i2)} required/>
                  <FormControl sx = {{maxWidth: '300px'}}>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={ele.type}
                      label="Type"
                      aria-label="select type"
                      required
                      onChange={(eve) => handleSelectChange(eve, i, i2)}
                    >
                      <MenuItem value={'number'}>Number</MenuItem>
                      <MenuItem value={'enum'}>Enum</MenuItem>
                    </Select>
                  </FormControl>
                  {ele.type == 'number' ? 
                    '':
                    <div key = {i2} style={{display: 'flex'}}> 
                      {ele.values.map((e, i3) => (
                        <div key={i3}>
                          <TextField id="outline-basic" sx={{m: '7px'}} aria-label="Option" label="Option Name" name="Option" value={e}
                            onChange={(eve) => handleEnumChange(eve, i, i2, i3)} required/>
                          {ele.values.length > 1 ? <IconButton aria-label="delete" onClick={(e) => handleOptionDelete(e, i, i2, i3)}><DeleteIcon/></IconButton>: ''}
                        </div>
                      ))} 
                      <Button sx={{mb: '10px'}} onClick={() => {
                        const newArray = JSON.parse(JSON.stringify(subcategories));
                        newArray[i].attributes[i2].values.push('');
                        setSubcategories(newArray);
                      }}>+ Option</Button>
                    </div>}
                  <IconButton aria-label="delete" onClick={(e) => handleAttributeDelete(e, i, i2)}><DeleteIcon/></IconButton>
                </div>
              )): ''}
              <Button sx={{mb: '10px'}} onClick={() => {
                const arr = JSON.parse(JSON.stringify(subcategories));
                if(arr[i].attributes) {
                  arr[i].attributes.push(JSON.parse(JSON.stringify({name: '', type: 'enum', values: ['']})))
                } else {
                  arr[i].attributes = [JSON.parse(JSON.stringify({name: '', type: 'enum', values: ['']}))]
                }
                setSubcategories(arr);
              }}>
                  + Add Attribute
              </Button>    
            </div>))
        }
        <Button variant='outlined' sx={{mb: '10px', maxWidth: '350px', mt: '15px'}} onClick={() => {
          setCounter(counter+1);
          setSubcategories(subcategories.concat([{name: "", attributes: []}]));
        }}>
          + Add SubCategory
        </Button>
        <Button sx ={{maxWidth: '350px'}} variant="contained" type='submit'>Create</Button>
      </Box>
    </>
  );
}