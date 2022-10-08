import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiForbiddenResponse } from '@nestjs/swagger'

import { ErrorResponse } from '~/shared/error'

import { JwtAuthRequired } from '../../auth/decorators/jwt-auth.decorator'
import { RecipeOwnerGuard } from '../guards/owner.guard'

export function RecipeOwnerRequired() {
  return applyDecorators(
    JwtAuthRequired(),
    UseGuards(RecipeOwnerGuard),
    ApiForbiddenResponse({ type: ErrorResponse, description: 'Access denied' }),
  )
}
