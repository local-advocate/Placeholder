import { Resolver, Query, Arg, Authorized, Mutation, Ctx, Args } from "type-graphql"
import { ProductService } from "./service";
import { Product, ProductInput, ProductArgs, ProductCreateOutput } from "./schema";
import type { NextApiRequest } from 'next';

@Resolver()
export class ProductResolver {
  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return new ProductService().getAll();
  }

  @Query(() => [Product])
  async productsFiltered(
    @Arg('filters') filters: string
  ): Promise<Product[]> {
    return new ProductService().getAllFiltered(filters);
  }

  @Query(() => Product)
  async product(
    @Args() {id}: ProductInput
  ): Promise<Product> {
    return new ProductService().getOne(id);
  }

  @Authorized("member")
  @Mutation(() => ProductCreateOutput)
  async createProduct(
    @Arg("input") input : ProductArgs,
    @Ctx() request: NextApiRequest
  ): Promise<ProductCreateOutput> {
    return new ProductService().createProduct(request.user.id, input);
  }

  @Authorized("member")
  @Mutation(() => String)
  async deleteProduct(
    @Arg("id") id: string,
  ): Promise<string> {
    return new ProductService().deleteProduct(id);
  }

  @Authorized("member")
  @Query(() => [Product])
  async getOwnProducts(
    @Ctx() request: NextApiRequest
  ): Promise<Product[]> {
    return new ProductService().getOwnProducts(request.user.id);
  }
}
