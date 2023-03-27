import { createYoga } from 'graphql-yoga'
import 'reflect-metadata'; // must come before buildSchema
// import { buildSchema } from "type-graphql"
import { buildSchemaSync } from "type-graphql"
import { nextAuthChecker } from '../../graphql/auth/checker';

import { AuthResolver } from '../../graphql/auth/resolver'
import { UserResolver } from '../../graphql/user/resolver'
import { ProductResolver } from '../../graphql/product/resolver';
import { ImageResolver } from '../../graphql/image/resolver';
import { CategoryResolver } from '../../graphql/category/resolver';
import { MessageResolver } from '../../graphql/message/resolver';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

// schema = await buildSchema({
const schema = buildSchemaSync({
  resolvers: [AuthResolver, UserResolver, ProductResolver, ImageResolver, CategoryResolver, MessageResolver],
  validate: true,
  authChecker: nextAuthChecker,
});

export default createYoga({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',
});
