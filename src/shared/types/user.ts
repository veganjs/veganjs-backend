import { Role } from './roles'

export type JwtUser = {
  id: string
  username: string
  avatar: string
  roles: Role[]
  createdAt: string
}
