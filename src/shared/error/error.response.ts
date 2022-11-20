import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsISO8601, IsNumber, IsString } from 'class-validator'

import { DateISO } from '../types'

enum Method {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
}

export class ErrorResponse {
  @IsNumber()
  @ApiProperty({ description: 'Response status code', example: 400 })
  statusCode: number

  @IsISO8601()
  @ApiProperty({ description: 'Request timestamp', format: 'date-time' })
  timestamp: DateISO

  @IsString()
  @ApiProperty({ description: 'Request URL', example: '/api/auth/login' })
  path: string

  @IsEnum(Method)
  @ApiProperty({
    enum: Method,
    example: Method.Post,
    description: 'Request method',
  })
  method: Method

  @IsString()
  @ApiProperty({
    description: 'Error message(-s)',
    example: 'password is too weak',
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  })
  message: string | string[]
}
