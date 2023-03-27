import { Resolver, Mutation, Arg, Query } from "type-graphql"
import { User, UserInput, UserInfo } from "./schema"
import { UserService } from "./service"

@Resolver()
export class UserResolver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation(() => User)
  async signup(
    @Arg("input") input: UserInput,
  ): Promise<User> {
    return new UserService().signup(input);
  }

  @Query(() => UserInfo)
  async getUser(
    @Arg("id") id: string,
  ): Promise<UserInfo | undefined> {
    return await new UserService().getUser(id);
  }
}
