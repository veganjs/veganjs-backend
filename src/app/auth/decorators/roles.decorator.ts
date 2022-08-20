import { SetMetadata } from '@nestjs/common'

import { Role } from '../auth.types'

export const RolesAllowed = (...roles: Role[]) => SetMetadata('roles', roles)
