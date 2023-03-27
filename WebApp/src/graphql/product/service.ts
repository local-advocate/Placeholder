import { Product, ProductArgs, ProductCreateOutput } from "./schema"

export class ProductService {
  public async getAll(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3013/api/v0/product/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          resolve(res.json());
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Cannot get products"));
        });
    });
  }

  public async getAllFiltered(filters: string): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3013/api/v0/product/filtered?filters=${filters}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          resolve(res.json());
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Cannot get filtered products"));
        });
    });
  }

  public async getOne(id: string) : Promise<Product> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3013/api/v0/product/${id}`, {
        method: 'GET',
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
        .then((product) => {
          resolve(product);
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error getting product"));
        });
    });
  }

  public async createProduct(user_id: string, productJSON: ProductArgs): Promise<ProductCreateOutput> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3013/api/v0/product?user_id=${user_id}`, {
        method: 'POST',
        body: JSON.stringify(productJSON),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          return resolve(res.json());
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error creating product"));
        });
    });
  }

  public async getOwnProducts(user_id: string): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3013/api/v0/product?user_id=${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          return resolve(res.json());
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error getting your products"));
        });
    });
  }

  public async deleteProduct(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3013/api/v0/product/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if(!res.ok) {
            throw(res);
          }
          return res.json();
        })
        .then((id) => {
          resolve(id);
        })
        .catch((err) => {
          console.log(err);
          reject(new Error('Delete: Product not found'));
        })
    })
  }
}
