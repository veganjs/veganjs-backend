import { applyDecorators, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { Role } from '../auth.types'
import { AuthGuard } from '../guards/jwt-auth.guard'
import { RolesGuard } from '../guards/roles.guard'
import { RolesAllowed } from './roles.decorator'

export function Auth(...roles: Role[]) {
  const defaultDecorators = [
    ApiBearerAuth('access-token'),
    ApiUnauthorizedResponse({ description: 'Invalid credentials' }),
  ]

  if (roles?.length > 0) {
    return applyDecorators(
      ...defaultDecorators,
      RolesAllowed(...roles),
      UseGuards(AuthGuard, RolesGuard),
      ApiForbiddenResponse({ description: 'Access denied' }),
    )
  }

  return applyDecorators(
    ...defaultDecorators,
    UseGuards(AuthGuard),
    ApiBearerAuth('access-token'),
  )
}
