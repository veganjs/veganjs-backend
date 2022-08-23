import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'

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
      description: `${model.name} has been created`,
    }),
    ApiBadRequestResponse({ description: 'Invalid body' }),
    ApiOperation({
      summary: `Create new ${model.name.toLowerCase()}`,
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
