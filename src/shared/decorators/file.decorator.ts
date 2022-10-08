import { applyDecorators } from '@nestjs/common'
import {
  ApiBody,
  ApiConsumes,
  ApiBadRequestResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger'

import { ErrorResponse } from '../error'

const ApiFile =
  (fileName = 'file'): MethodDecorator =>
  (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor)
  }

export const ApiFormData = () => {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiFile(),
    ApiUnsupportedMediaTypeResponse({
      type: ErrorResponse,
      description: 'Invalid mimetype',
    }),
    ApiBadRequestResponse({
      type: ErrorResponse,
      description: 'Invalid content-type or no file provided',
    }),
  )
}
