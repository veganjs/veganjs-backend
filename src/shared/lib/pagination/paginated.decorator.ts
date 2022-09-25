import { applyDecorators, Type } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

import { Paginated } from './paginated'

interface PaginatedResponseParams<Model> {
  model: Model
  description: string
}

export const ApiPaginatedResponse = <Model extends Type<unknown>>({
  model,
  description,
}: PaginatedResponseParams<Model>) => {
  return applyDecorators(
    ApiExtraModels(Paginated),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(Paginated) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
      description,
    }),
  )
}
