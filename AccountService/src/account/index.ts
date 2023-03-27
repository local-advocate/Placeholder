/**
 * Stringified UUIDv4.
 * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
 * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
 * @format uuid
 */
export type UUID = string;

/**
 * Email address
 * @pattern ^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$
 * @example "example@example.com"
 */
export type EMAIL = string;

export interface Account {
  email: EMAIL,
  name: string,
  password: string
}

export interface FullAccount {
  id: UUID,
  email: EMAIL,
  name: string,
  roles: string
}

export interface Credentials {
  email: EMAIL,
  password: string
}

export interface UserInfo {
  id: UUID,
  name: string,
}