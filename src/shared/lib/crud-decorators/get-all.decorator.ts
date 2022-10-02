import { applyDecorators, HttpCode, HttpStatus, Type } from '@nestjs/common'
import { ApiQuery, ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { ApiPaginatedResponse } from '../pagination'
import { getModelName } from './model-name'

interface ApiGetManyParams<Model> {
  name?: string
  model: Model
  search?: boolean
  filters?: boolean
  paginated?: boolean
}

export const ApiGetMany = <Model extends Type<unknown>>({
  name,
  model,
  search = false,
  filters = false,
  paginated = false,
}: ApiGetManyParams<Model>) => {
  const targetName = name ?? getModelName(model)
  const operation = filters ? 'Search' : 'Get many'

  const defaultDecorators = [
    ApiOkResponse({
      type: [model],
      description: `${targetName} list has been fetched`,
    }),
    ApiOperation({
      summary: `${operation} ${targetName.toLowerCase()} items`,
    }),
  ]

  const decorators = [...defaultDecorators]

  if (paginated) {
    const description = filters
      ? `${targetName} search results`
      : `${targetName} list has been fetched`
    decorators.push(
      ApiPaginatedResponse({
        model,
        description,
      }),
    )
  }

  if (search) {
    decorators.push(
      ApiQuery({
        name: 'search',
        description: 'Search query',
        required: false,
      }),
    )
  }

  if (filters) {
    decorators.push(HttpCode(HttpStatus.OK))
  }

  return applyDecorators(...decorators)
}
