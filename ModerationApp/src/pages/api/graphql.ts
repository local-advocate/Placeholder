import { createYoga } from 'graphql-yoga'
import 'reflect-metadata'; // must come before buildSchema
// import { buildSchema } from "type-graphql"
import { buildSchemaSync } from "type-graphql"
import { nextAuthChecker } from '../../graphql/auth/checker';

import { AuthResolver } from '../../graphql/auth/resolver'
import { ProductResolver } from '../../graphql/product/resolver';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

// schema = await buildSchema({
const schema = buildSchemaSync({
  resolvers: [AuthResolver, ProductResolver],
  validate: true,
  authChecker: nextAuthChecker,
});

export default createYoga({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',
});
