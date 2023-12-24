import { DateISO } from './lib'

export type JwtUser = {
  id: string
  email: string
  avatar: string
  // roles: Role[]
  createdAt: DateISO
}
