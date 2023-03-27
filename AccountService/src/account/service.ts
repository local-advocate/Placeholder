import { Account, Credentials, FullAccount, UUID, UserInfo } from '.';
import { pool } from '../db';

export class AccountService {

  // login
  public async get(creds: Credentials): Promise<FullAccount|undefined> {
    const select = 
      ` SELECT people - 'hash' || jsonb_build_object('id', user_id)` +
      ` AS people FROM people` +
      ` WHERE people->>'email' = $1` +
      ` AND people->>'hash' = crypt($2,people->>'hash')`
    const query = {
      text: select,
      values: [creds.email, creds.password],
    };
    const {rows} = await pool.query(query)
    return rows.length === 1 ? rows[0].people : undefined
  }

  // signup
  public async create(user: Account): Promise<FullAccount|undefined> {

    // Create user and return (error if exists already)
    const insert = 'WITH result AS ' +
    '(INSERT INTO people(people)' +
    ` VALUES (jsonb_build_object('email', $1::text, 'name', $2::text, 'roles', ARRAY['member']::text[], 'hash', crypt($3::text, gen_salt('md5'))))` +
    ' RETURNING user_id, people) ' +
    `SELECT people -'hash' || jsonb_build_object('id', user_id) AS people FROM result`;
    const query = {
      text: insert,
      values: [user.email, user.name, user.password],
    };
    try {
      const {rows} = await pool.query(query);
      return rows[0].people;
    } catch {
      return undefined;
    }
  }

  // get name from id
  public async getName(id: UUID): Promise<UserInfo|undefined> {
    const select = 
      `SELECT (jsonb_build_object('id', user_id) || jsonb_build_object('name',people->>'name')) as user FROM people WHERE user_id = $1`;
    const query = {
      text: select,
      values: [id],
    };
  
    const {rows} = await pool.query(query);
    return rows.length === 1 ? rows[0]: undefined;
  }
}