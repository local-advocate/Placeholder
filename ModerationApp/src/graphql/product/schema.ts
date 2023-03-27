import { ObjectType, Field, InputType } from "type-graphql";
import { Matches } from "class-validator";

@ObjectType()
export class Product {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    id!: string 
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    seller!: string
  @Field()
    price!: number
  @Field()
    name!: string
  @Field({nullable:true})
    condition?: string
  @Field({nullable:true})
    description?: string
  @Field()
    reason!: string
  @Field({nullable:true})
    attributes?: string
}

@ObjectType()
@InputType("ProductInput")
export class ProductArgs {
  @Field({nullable:true})
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    id?: string
  @Field()
    name!: string 
  @Field({nullable:true})
    description?: string
}