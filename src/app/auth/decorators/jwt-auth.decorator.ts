import { applyDecorators, UseGuards } from '@nestjs/common'
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { Role } from '~/shared/types'

import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { RolesGuard } from '../guards/roles.guard'
import { RolesAllowed } from './roles.decorator'

export function JwtAuthRequired(...roles: Role[]) {
  const defaultDecorators = [
    ApiCookieAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  ]

  if (roles?.length > 0) {
    return applyDecorators(
      ...defaultDecorators,
      RolesAllowed(...roles),
      UseGuards(JwtAuthGuard, RolesGuard),
      ApiForbiddenResponse({ description: 'Access denied' }),
    )
  }

  return applyDecorators(...defaultDecorators, UseGuards(JwtAuthGuard))
}
