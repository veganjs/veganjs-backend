import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'

import { ErrorResponse } from '../../error'
import { getModelName } from './lib'

interface ApiUpdateParams<Model> {
  name?: string
  model: Model
  attribute?: string
  conflict?: boolean
}

export const ApiUpdate = <Model extends Type<unknown>>({
  name,
  model,
  attribute = 'id',
  conflict = false,
}: ApiUpdateParams<Model>) => {
  const targetName = name ?? getModelName(model)

  const defaultDecorators = [
    ApiOkResponse({
      type: model,
      description: `${targetName} has been updated`,
    }),
    ApiNotFoundResponse({
      type: ErrorResponse,
      description: `${targetName} not found`,
    }),
    ApiBadRequestResponse({ type: ErrorResponse, description: 'Invalid body' }),
    ApiOperation({
      summary: `Update ${targetName.toLowerCase()} by ${attribute}`,
    }),
  ]

  if (conflict) {
    return applyDecorators(
      ...defaultDecorators,
      ApiConflictResponse({
        type: ErrorResponse,
        description: `${targetName} already exists`,
      }),
    )
  }

  return applyDecorators(...defaultDecorators)
}
