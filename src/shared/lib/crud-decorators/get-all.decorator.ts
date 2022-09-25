import { applyDecorators, Type } from '@nestjs/common'
import { ApiQuery, ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { ApiPaginatedResponse } from '../pagination'
import { getModelName } from './model-name'

interface ApiGetManyParams<Model> {
  name?: string
  model: Model
  search?: boolean
  paginated?: boolean
}

export const ApiGetMany = <Model extends Type<unknown>>({
  name,
  model,
  search = false,
  paginated = false,
}: ApiGetManyParams<Model>) => {
  const targetName = name ?? getModelName(model)

  const defaultDecorators = [
    ApiOkResponse({
      type: [model],
      description: `${targetName} list has been fetched`,
    }),
    ApiOperation({
      summary: `Get many ${targetName.toLowerCase()} items`,
    }),
  ]

  const decorators = [...defaultDecorators]

  if (paginated) {
    decorators.push(
      ApiPaginatedResponse({
        model,
        description: `${targetName} list has been fetched`,
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

  return applyDecorators(...decorators)
}
