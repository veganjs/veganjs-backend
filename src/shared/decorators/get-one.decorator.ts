import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'

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
      description: `${model.name} has been fetched`,
    }),
    ApiNotFoundResponse({ description: `${model.name} not found` }),
    ApiBadRequestResponse({ description: 'Invalid parameter' }),
    ApiOperation({
      summary: `Get ${model.name.toLowerCase()} by ${attribute}`,
    }),
  )
}
