import { Query, Resolver, Args } from "type-graphql"

import { Credentials, AuthUser } from "./schema"
import { AuthService } from "./service"

@Resolver()
export class AuthResolver {
  @Query(() => AuthUser)
  async login(
    @Args() credentials: Credentials,
  ): Promise<AuthUser|undefined> {
    return new AuthService().login(credentials);
  }
}