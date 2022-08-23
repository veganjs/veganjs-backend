import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'

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
      description: `${model.name} has been deleted`,
    }),
    ApiNotFoundResponse({ description: `${model.name} not found` }),
    ApiBadRequestResponse({ description: 'Invalid parameter' }),
    ApiOperation({
      summary: `Delete ${model.name.toLowerCase()} by ${attribute}`,
    }),
  )
}
