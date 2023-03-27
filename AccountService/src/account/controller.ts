import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  Path,
  Get,
  SuccessResponse,
} from 'tsoa';

import { Account, Credentials, FullAccount, UUID, UserInfo } from '.';
import { AccountService } from './service';

@Route('account')
export class AccountController extends Controller {
  @Post('login')
  @Response('404', 'Unknown')
  public async get(
    @Body() credentials: Credentials,
  ): Promise<FullAccount|undefined> {
    return new AccountService().get(credentials)
      .then(async (account: FullAccount|undefined): Promise<FullAccount|undefined> => {
        if (!account) {
          this.setStatus(404)
        }
        return account
      });
  }

  @Post('signup')
  @Response('409', 'User already exists')
  @SuccessResponse('201', 'User created')
  public async create(
    @Body() account: Account,
  ): Promise<FullAccount|undefined> {
    return new AccountService().create(account)
      .then((account: FullAccount|undefined): FullAccount|undefined => {
        if (!account) {
          this.setStatus(409);
        }
        return account;
      });
  }

  @Get('id/{id}')
  @Response('404', 'Not found')
  public async getName(
    @Path() id: UUID,
  ): Promise<UserInfo|undefined> {
    const res = await new AccountService().getName(id)
    if (!res) {
      this.setStatus(404);
    } else {
      return res;
    }
  }
}

