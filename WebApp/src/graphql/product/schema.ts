import { ObjectType, Field, InputType, ArgsType} from "type-graphql";
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
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    category!: string
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    subcategory!: string
  @Field()
    name!: string
  @Field({nullable:true})
    sellername?: string
  @Field({nullable:true})
    description?: string
  @Field()
    mainImage!: string
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type)=> [String])
    images!: string[]
  @Field()
    attributes!: string
}

// get by id
@ArgsType()
export class ProductInput {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    id!: string
}

@ObjectType()
@InputType("ProductInput")
export class ProductArgs {
  // fix later
  @Field()
  @Matches(/.*/)
    name!: string 
  @Field()
    price!: number
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    category!: string
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    subcategory!: string
  @Field()
    description!: string
  @Field()
    attributes!: string
}

@ObjectType()
export class ProductCreateOutput {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    id!: string
  @Field()
  @Field()
    price!: number
  @Field()
    name!: string
  @Field()
    description!: string
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    seller!: string
}