
// We are using *id*, *name*, and *roles* to sign
// and check the auth header.
export type SessionUser = {
	id: string,
	roles: string[],
	name: string
}
