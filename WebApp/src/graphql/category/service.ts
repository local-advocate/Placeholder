import { CategoryList, CategoryDetail } from "./schema"

export class CategoryService {
  public async getAll(): Promise<CategoryList[]> {
    console.log('List Categories.');
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
          resolve(categories as CategoryList[])
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error Getting Categories"));
        });
    });
  }

  public async getSubcategory(id: string): Promise<CategoryDetail> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3012/api/v0/category/subcategory/' + id, {
        method: 'Get',
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
        .then((subcategory) => {
          resolve(subcategory as CategoryDetail)
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error Getting Subcategory"));
        });
    });
  }
}