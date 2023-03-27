import { Resolver, Query, Arg, Authorized, Mutation } from "type-graphql"
import { ProductService } from "./service";
import { Product, ProductArgs  } from "./schema";

@Resolver()
export class ProductResolver {
  @Authorized("moderator")
  @Mutation(() => String)
  async deleteListing(
    @Arg("id") id: string,
  ): Promise<string> {
    return new ProductService().deleteOne(id);
  }

  @Authorized("moderator")
  @Query(() => [Product])
  async getFlaggedProducts(
  ): Promise<Product[]> {
    return new ProductService().getFlaggedProducts();
  }

  @Authorized("moderator")
  @Mutation(() => String)
  async updateProduct(
    @Arg("input") product: ProductArgs,
  ): Promise<string> {
    return new ProductService().updateProduct(product);
  }

  @Authorized("moderator")
  @Mutation(() => String)
  async approveProduct(
    @Arg("id") id: string,
  ): Promise<string> {
    return new ProductService().approveProduct(id);
  }
}
