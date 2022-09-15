import { applyDecorators, Type } from '@nestjs/common'
import { ApiQuery, ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { getModelName } from '../lib/getModelName'
import { ApiPaginatedResponse } from './paginated.decorator'

interface ApiGetManyParams<Model> {
  model: Model
  search?: boolean
  paginated?: boolean
}

export const ApiGetMany = <Model extends Type<unknown>>({
  model,
  search = false,
  paginated = false,
}: ApiGetManyParams<Model>) => {
  const defaultDecorators = [
    ApiOkResponse({
      type: [model],
      description: `${getModelName(model)} list has been fetched`,
    }),
    ApiOperation({
      summary: `Get many ${getModelName(model).toLowerCase()} items`,
    }),
  ]

  const decorators = [...defaultDecorators]

  if (paginated) {
    decorators.push(
      ApiPaginatedResponse({
        model,
        description: `${getModelName(model)} list has been fetched`,
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
