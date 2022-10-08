import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { ErrorResponse } from '~/shared/error'

import { JwtAuthRefreshGuard } from '../guards/jwt-auth-refresh.guard'

export function JwtAuthRefreshRequired() {
  return applyDecorators(
    UseGuards(JwtAuthRefreshGuard),
    ApiUnauthorizedResponse({
      type: ErrorResponse,
      description: 'Unauthorized',
    }),
    ApiCookieAuth(),
  )
}
