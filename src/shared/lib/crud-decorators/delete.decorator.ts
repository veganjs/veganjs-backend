import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'

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
    ApiOkResponse({
      description: `${targetName} has been deleted`,
    }),
    ApiNotFoundResponse({ description: `${targetName} not found` }),
    ApiBadRequestResponse({ description: 'Invalid parameter' }),
    ApiOperation({
      summary: `Delete ${targetName.toLowerCase()} by ${attribute}`,
    }),
  )
}
