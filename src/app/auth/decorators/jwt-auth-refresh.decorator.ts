import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { JwtAuthRefreshGuard } from '../guards/jwt-auth-refresh.guard'

export function JwtAuthRefreshRequired() {
  return applyDecorators(
    UseGuards(JwtAuthRefreshGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiCookieAuth(),
  )
}
