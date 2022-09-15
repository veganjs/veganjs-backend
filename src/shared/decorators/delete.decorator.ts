import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'

import { getModelName } from '../lib/getModelName'

interface ApiDeleteParams<Model> {
  model: Model
  attribute?: string
}

export const ApiDelete = <Model extends Type<unknown>>({
  model,
  attribute = 'id',
}: ApiDeleteParams<Model>) => {
  return applyDecorators(
    ApiOkResponse({
      description: `${getModelName(model)} has been deleted`,
    }),
    ApiNotFoundResponse({ description: `${getModelName(model)} not found` }),
    ApiBadRequestResponse({ description: 'Invalid parameter' }),
    ApiOperation({
      summary: `Delete ${getModelName(model).toLowerCase()} by ${attribute}`,
    }),
  )
}
