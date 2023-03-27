import { Product, ProductArgs} from "./schema"

export class ProductService {
  public async deleteOne(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3013/api/v0/product/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((id) => {
          resolve(id);
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Cannot delete product"));
        });
    });
  }

  public async getFlaggedProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3013/api/v0/product/flagged`, {
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
          reject(new Error("Error getting flagged products"));
        });
    });
  }

  public async updateProduct(product: ProductArgs): Promise<string> {
    const {id, ...rest} = product;
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3013/api/v0/product/update?product_id=' + id, {
        method: 'POST',
        body: JSON.stringify(rest),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((product) => {
          resolve(product);
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Cannot update product"));
        });
    });
  }

  public async approveProduct(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3013/api/v0/product/approve?product_id=' + id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((id) => {
          resolve(id);
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Cannot approve product"));
        });
    });
  }
}
