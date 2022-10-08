import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'

import { getModelName } from './lib'

interface ApiCreateParams<Model> {
  name?: string
  model: Model
  conflict?: boolean
}

export const ApiCreate = <Model extends Type<unknown>>({
  name,
  model,
  conflict = false,
}: ApiCreateParams<Model>) => {
  const targetName = name ?? getModelName(model)

  const defaultDecorators = [
    ApiCreatedResponse({
      type: model,
      description: `${targetName} has been created`,
    }),
    ApiBadRequestResponse({ description: 'Invalid body' }),
    ApiOperation({
      summary: `Create new ${targetName.toLowerCase()}`,
    }),
  ]

  if (conflict) {
    return applyDecorators(
      ...defaultDecorators,
      ApiConflictResponse({
        description: `${targetName} already exists`,
      }),
    )
  }

  return applyDecorators(...defaultDecorators)
}
