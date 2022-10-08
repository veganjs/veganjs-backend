import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'

import { ErrorResponse } from '../../error'
import { getModelName } from './lib'

interface ApiGetOneParams<Model> {
  name?: string
  model: Model
  attribute?: string
}

export const ApiGetOne = <Model extends Type<unknown>>({
  name,
  model,
  attribute = 'id',
}: ApiGetOneParams<Model>) => {
  const targetName = name ?? getModelName(model)

  return applyDecorators(
    ApiOkResponse({
      type: model,
      description: `${targetName} has been fetched`,
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
      summary: `Get ${targetName.toLowerCase()} by ${attribute}`,
    }),
  )
}
