import { Resolver, Query, Arg } from "type-graphql"
import { CategoryService } from "./service";
import { CategoryList, CategoryDetail } from "./schema";

@Resolver()
export class CategoryResolver {
  @Query(() => [CategoryList])
  async categories(): Promise<CategoryList[]> {
    return await new CategoryService().getAll();
  }

  @Query(() => CategoryDetail)
  async subcategoryDetails(
    @Arg("id") id: string,
  ): Promise<CategoryDetail | undefined> {
    return await new CategoryService().getSubcategory(id);
  }
}