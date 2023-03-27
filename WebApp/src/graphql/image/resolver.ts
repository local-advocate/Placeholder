import { Resolver, Arg, Mutation } from "type-graphql"
import { ImageService } from "./service"

@Resolver()
export class ImageResolver {
    @Mutation(() => String)
  async uploadImage(
        @Arg("data") data: string,
        @Arg("product") id: string,
        @Arg("order") order: number,
  ): Promise<string> {
    return new ImageService().upload(data, id, order);
  }
}