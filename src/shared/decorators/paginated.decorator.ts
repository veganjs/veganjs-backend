import { applyDecorators, Type } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

import { Paginated } from '../types'

export const ApiPaginatedResponse = <Model extends Type<unknown>>(
  model: Model,
) => {
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
    }),
  )
}
