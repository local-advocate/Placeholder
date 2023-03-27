import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Response,
  Route,
  Delete,
  SuccessResponse,
} from 'tsoa'

import { ImageUploadArgs, Product, ProductArgs, ProductCreateOutput, UUID, UpdateProductArgs } from '.'
import { ProductService } from './service'
import { ImageService } from "./service"

@Route('product')
export class ProductController extends Controller {

  @Post()
  @SuccessResponse('201', 'Product created')
  public async createProduct(
    @Query() user_id: UUID,
    @Body() product: ProductArgs,
  ): Promise<ProductCreateOutput> {
    return await new ProductService().createProduct(user_id, product);
  }

  @Get('')
  public async getAll(
    @Query() user_id?: UUID,
  ): Promise<Product[]> {
    return await new ProductService().getAll(user_id);
  }

  @Get('flagged')
  public async getFlagged(
  ): Promise<Product[]> {
    return await new ProductService().getFlagged()
      .then(async (products: Product[]): Promise<Product[]> => {
        return products;
      });
  }

  @Get('{id}')
  @Response('404', 'Not Found')
  public async getOne(
    @Path() id: UUID
  ): Promise<Product|undefined> {
    return await new ProductService().getOne(id)
      .then(async (product: Product|undefined): Promise<Product|undefined> => {
        if (!product) {
          this.setStatus(404);
        }
        return product;
      });
  }

  @Post('filtered')
  public async getFiltered(
    @Query() filters: string
  ): Promise<Product[]> {
    return await new ProductService().getAllFiltered(filters);
  }

  @Delete('{id}')
  @Response('404', 'Not Found')
  public async deleteOne(
    @Path() id: UUID
  ): Promise<string|undefined> {
    const res = await new ProductService().deleteOne(id)
    if (!res) {
      this.setStatus(404);
    } else { return res; }
  }

  @Post('update')
  @Response('404', 'Not found')
  public async updateProduct(
    @Query() product_id: UUID,
    @Body() product: UpdateProductArgs,
  ): Promise<string|undefined> {
    const res = await new ProductService().updateProduct(product_id, product)
    if (!res) {
      this.setStatus(404);
    } else { return res; }
  }

  @Post('approve')
  @Response('404', 'Not found')
  public async approveProduct(
    @Query() product_id: UUID,
  ): Promise<string|undefined> {
    const res = await new ProductService().approveProduct(product_id)
    if (!res) {
      this.setStatus(404);
    } else { return res; }
  }
}


@Route('image')
export class ImageResolver extends Controller {
  
  @Post()
  @Response('201', 'Image Uploaded')
  async uploadImage(
        @Body() {data, product, order}: ImageUploadArgs
  ): Promise<string> {
    return new ImageService().upload(data, product, order);
  }
}
