import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'

import { getModelName } from '../lib/getModelName'

interface ApiCreateParams<Model> {
  model: Model
  conflict?: boolean
}

export const ApiCreate = <Model extends Type<unknown>>({
  model,
  conflict = false,
}: ApiCreateParams<Model>) => {
  const defaultDecorators = [
    ApiCreatedResponse({
      type: model,
      description: `${getModelName(model)} has been created`,
    }),
    ApiBadRequestResponse({ description: 'Invalid body' }),
    ApiOperation({
      summary: `Create new ${getModelName(model).toLowerCase()}`,
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
