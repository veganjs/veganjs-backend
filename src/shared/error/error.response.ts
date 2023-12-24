import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class ErrorResponse {
  @IsNumber()
  @ApiProperty({ description: 'Response status code', example: 400 })
  statusCode: number

  @IsString()
  @ApiPropertyOptional({ description: 'Error name', example: 'Bad Request' })
  error: string

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
