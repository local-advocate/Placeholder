import { Field, ObjectType, ArgsType } from "type-graphql"
import { Length, Matches } from "class-validator";

const minPwdLen = 8;
const maxPwdLen = 16;

@ArgsType()
export class Credentials {
    @Field()
    @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
      email!: string
    @Field()
    @Length(minPwdLen, maxPwdLen)
      password!: string
}

@ObjectType()
export class AuthUser {
    @Field()
      name!: string
    @Field()
      accessToken!: string
}
