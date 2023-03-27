import { Resolver, Query, Authorized, Mutation, Arg } from "type-graphql"
import { CategoryService } from "./service";
import { CategoryList, CategoryInput } from "./schema";

@Resolver()
export class CategoryResolver {
  @Query(() => [CategoryList])
  async categories(): Promise<CategoryList[]> {
    return await new CategoryService().getAll();
  }

  @Authorized("admin")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(() => CategoryList)
  async createCategory(
    @Arg("input") input: CategoryInput,
  ): Promise<CategoryList> {
    return new CategoryService().create(input);
  }
}