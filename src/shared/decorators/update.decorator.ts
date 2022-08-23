import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'

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
      description: `${model.name} has been updated`,
    }),
    ApiNotFoundResponse({ description: `${model.name} not found` }),
    ApiBadRequestResponse({ description: 'Invalid body' }),
    ApiOperation({
      summary: `Update ${model.name.toLowerCase()} by ${attribute}`,
    }),
  ]

  if (conflict) {
    return applyDecorators(
      ...defaultDecorators,
      ApiConflictResponse({ description: `${model.name} already exists` }),
    )
  }

  return applyDecorators(...defaultDecorators)
}
