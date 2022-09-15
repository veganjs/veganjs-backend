import {
  Min,
  IsUUID,
  IsNumber,
  IsString,
  MaxLength,
  IsNotEmpty,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class StepDto {
  @IsUUID()
  @ApiProperty({ description: 'Step id', format: 'uuid' })
  id: string

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({ description: 'Step order number' })
  order: number

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @ApiProperty({ description: 'Step description' })
  description: string
}
