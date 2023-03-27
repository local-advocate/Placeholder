import { CategoryInput, CategoryList } from "./schema"

export class CategoryService {
  public async getAll(): Promise<CategoryList[]> {
    console.log('List Categories');
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3012/api/v0/category/list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((categories) => {
          console.log(categories);
          resolve(categories as CategoryList[])
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error Getting Categories"));
        });
    });
  }

  public async create(credentials: CategoryInput): Promise<CategoryList> {
    const subcategories = [];
    for(let i = 0; i < credentials.subcategories.length; i++) {
      if(credentials.attributes[i]) {
        let attribute = credentials.attributes[i];
        attribute = attribute.replace(/'/g, '"');
        subcategories.push({name: credentials.subcategories[i], attributes: attribute});
      } else {
        subcategories.push({name: credentials.subcategories[i], attributes: "{}"});
      }
      
    }
    const newCredentials = {name: credentials.name, subcategories: subcategories};
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3012/api/v0/category/create', {
        method: 'POST',
        body: JSON.stringify(newCredentials),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((categoryList) => {
          console.log(categoryList);
          resolve(categoryList as CategoryList)
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error creating category"));
        });
    });
  }
}