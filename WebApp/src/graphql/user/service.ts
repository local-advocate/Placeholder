import { User, UserInput, UserInfo } from "./schema";

export class UserService {
  public async signup(user: UserInput): Promise<User> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3011/api/v0/account/signup', {
        method: 'POST',
        body: JSON.stringify(user),
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
          resolve(user as User);
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error"));
        });
    });
  }

  public async getUser(id: string): Promise<UserInfo> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3011/api/v0/account/id/' + id, {
        method: 'Get',
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
          resolve(user.user as UserInfo);
        })
        .catch((err) => {
          console.log(err)
          reject(new Error("Error Getting user"));
        });
    });
  }
}
