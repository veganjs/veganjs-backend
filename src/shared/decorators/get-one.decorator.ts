import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'

import { getModelName } from '../lib/getModelName'

interface ApiGetOneParams<Model> {
  model: Model
  attribute?: string
}

export const ApiGetOne = <Model extends Type<unknown>>({
  model,
  attribute = 'id',
}: ApiGetOneParams<Model>) => {
  return applyDecorators(
    ApiOkResponse({
      type: model,
      description: `${getModelName(model)} has been fetched`,
    }),
    ApiNotFoundResponse({ description: `${getModelName(model)} not found` }),
    ApiBadRequestResponse({ description: 'Invalid parameter' }),
    ApiOperation({
      summary: `Get ${getModelName(model).toLowerCase()} by ${attribute}`,
    }),
  )
}
