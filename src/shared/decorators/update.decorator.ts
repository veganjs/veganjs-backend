import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'

import { getModelName } from '../lib/getModelName'

interface ApiUpdateParams<Model> {
  model: Model
  attribute?: string
  conflict?: boolean
}

export const ApiUpdate = <Model extends Type<unknown>>({
  model,
  attribute = 'id',
  conflict = false,
}: ApiUpdateParams<Model>) => {
  const defaultDecorators = [
    ApiOkResponse({
      type: model,
      description: `${getModelName(model)} has been updated`,
    }),
    ApiNotFoundResponse({ description: `${getModelName(model)} not found` }),
    ApiBadRequestResponse({ description: 'Invalid body' }),
    ApiOperation({
      summary: `Update ${getModelName(model).toLowerCase()} by ${attribute}`,
    }),
  ]

  if (conflict) {
    return applyDecorators(
      ...defaultDecorators,
      ApiConflictResponse({
        description: `${getModelName(model)} already exists`,
      }),
    )
  }

  return applyDecorators(...defaultDecorators)
}
