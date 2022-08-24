import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiForbiddenResponse } from '@nestjs/swagger'

import { JwtAuthRequired } from '../../auth/decorators/jwt-auth.decorator'
import { RecipeOwnerGuard } from '../guards/owner.guard'

export function RecipeOwnerRequired() {
  return applyDecorators(
    JwtAuthRequired(),
    UseGuards(RecipeOwnerGuard),
    ApiForbiddenResponse({ description: 'Access denied' }),
  )
}
