import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger'

import { ErrorResponse } from '../../error'
import { getModelName } from './lib'

interface ApiDeleteParams<Model> {
  name?: string
  model: Model
  attribute?: string
}

export const ApiDelete = <Model extends Type<unknown>>({
  name,
  model,
  attribute = 'id',
}: ApiDeleteParams<Model>) => {
  const targetName = name ?? getModelName(model)

  return applyDecorators(
    ApiNoContentResponse({
      description: `${targetName} has been deleted`,
    }),
    ApiNotFoundResponse({
      type: ErrorResponse,
      description: `${targetName} not found`,
    }),
    ApiBadRequestResponse({
      type: ErrorResponse,
      description: 'Invalid parameter',
    }),
    ApiOperation({
      summary: `Delete ${targetName.toLowerCase()} by ${attribute}`,
    }),
  )
}
