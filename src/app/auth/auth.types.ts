export enum Role {
  ADMIN = 'admin',
}

export type JwtPayload = {
  id: string
  username: string
  roles: Role[]
}
