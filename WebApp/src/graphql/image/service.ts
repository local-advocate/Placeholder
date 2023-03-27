export class ImageService {
  public async upload(data: string, product: string, order: number): Promise<string>{
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3013/api/v0/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({data: data, product: product, order: order}),
      })
        .then((res) => {
          resolve(res.json());
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Failed to upload image"));
        });
    });
  }
}