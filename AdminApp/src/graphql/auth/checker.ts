import { AuthChecker } from "type-graphql"
import type { NextApiRequest } from 'next'

import { AuthService } from "./service"

async function authChecker(context: NextApiRequest, authHeader: string | undefined, roles: string[]): Promise<boolean> {
  try {
    context.user = await new AuthService().check(authHeader, roles)
  } catch (err) {
    return false
  }
  return true
}

export const nextAuthChecker: AuthChecker<NextApiRequest> = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { root, args, context, info }, roles,) => 
{
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return await authChecker(context, context.req.headers.authorization, roles)
};