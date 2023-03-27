import { ObjectType, Field, InputType } from "type-graphql";
import { Matches, MaxLength } from "class-validator";

@ObjectType()
export class Category {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    id!: string 
  @Field()
    name!: string
}

@ObjectType()
export class Subcategory {
  @Field()
  @Matches(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/)
    id!: string 
  @Field()
    name!: string
  @Field()
    attributes!: string
}

@ObjectType()
export class CategoryList {
  @Field()
    category!: Category 
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type)=> [Subcategory])
    subcategories!: Subcategory[]
}

@InputType('CategoryInput')
export class CategoryInput {
  @MaxLength(100)
  @Field()
    name!: string;
  @Field(()=> [String])
    subcategories!: string[]
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type)=> [String])
    attributes!: string[]
}

@ObjectType()
export class Attributes {
  @MaxLength(100)
  @Field()
    name!: string;
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type)=> [String])
    values!: string[]
  @Field()
    type!: string
}

@ObjectType()
export class SubcategoryInput {
  @MaxLength(100)
  @Field()
    name!: string;
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type)=> [Attributes])
    attributes!: Attributes[]
}

@ObjectType()
export class CategoryDetail {
  @Field()
    category!: Category
  @Field()
    subcategory!: Subcategory
}