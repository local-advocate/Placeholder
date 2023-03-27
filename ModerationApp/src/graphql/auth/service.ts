import * as jwt from "jsonwebtoken";

import { Credentials, AuthUser } from './schema';
import { SessionUser } from '../../types/custom';

export class AuthService {
  public async login(credentials: Credentials): Promise<AuthUser|undefined>  {
    console.log('login');
    console.log(process.env.ACCESS_TOKEN);
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3011/api/v0/account/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((user) => {
          if(!user.roles.includes('moderator')) {
            reject(new Error("Unauthorised"));
          }
          const accessToken = jwt.sign(
            {id: user.id, name: user.name, roles: user.roles},
            //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            process.env.ACCESS_TOKEN!, {
              expiresIn: '30m',
              algorithm: 'HS256'
            });
          resolve({name: user.name, accessToken: accessToken});
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Unauthorised"));
        });
    });
  }

  public async check(authHeader?: string, roles?: string[]): Promise<SessionUser>  {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        reject(new Error("Unauthorised"));
      }
      else {
        const token = authHeader.split(' ');
        if(token[0] !== 'Bearer') {
          reject(new Error("Unauthorized"));
        } else {
          jwt.verify(token[1], process.env.ACCESS_TOKEN as string, (error, user) => {
            const dec = user as SessionUser;
            if (error) {
              reject(error);
            } else if (roles) {
              for (const role of roles) {
                if (!dec.roles || !dec.roles.includes(role)) {
                  reject(new Error("Unauthorised"));
                }
              }
            }
            resolve(dec);
          });
        }
      }
    });
  }
}
