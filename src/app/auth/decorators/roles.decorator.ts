import { SetMetadata } from '@nestjs/common'

import { Role } from '~/shared/types'

export const RolesAllowed = (...roles: Role[]) => SetMetadata('roles', roles)
