/**
 * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
 */
export type UUID = string;

export interface Product {
  id: UUID,
  seller: UUID,
  price: number,
  category: UUID,
  subcategory: UUID,
  name: string,
  sellername: string,
  description: string,
  mainImage: string,
  images: string[],
  attributes: string,
}

export interface ProductArgs {
    price: number,
    category: UUID,
    subcategory: UUID,
    description: string,
    name: string,
    attributes: string,
}

export interface ProductCreateOutput {
    id: UUID,
    price: number,
    name: string,
    description: string,   
    seller: UUID
}

export interface ImageUploadArgs {
  data: string,
  product: UUID,
  order: number
}

export interface UpdateProductArgs {
  name: string,
  description: string,
}