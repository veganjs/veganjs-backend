import { applyDecorators } from '@nestjs/common'
import {
  ApiBody,
  ApiConsumes,
  ApiBadRequestResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger'

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
    ApiUnsupportedMediaTypeResponse({ description: 'Invalid mimetype' }),
    ApiBadRequestResponse({
      description: 'Invalid content-type or no file provided',
    }),
  )
}
