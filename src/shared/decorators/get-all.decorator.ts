import { applyDecorators, Type } from '@nestjs/common'
import { ApiQuery, ApiOkResponse, ApiOperation } from '@nestjs/swagger'

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
      description: `${model.name} list has been fetched`,
    }),
    ApiOperation({
      summary: `Get many ${model.name.toLowerCase()} items`,
    }),
  ]

  const decorators = [...defaultDecorators]

  if (paginated) {
    decorators.push(
      ApiPaginatedResponse({
        model,
        description: `${model.name} list has been fetched`,
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
