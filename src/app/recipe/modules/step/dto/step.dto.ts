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
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @ApiProperty()
  description: string
}

export class Step extends StepDto {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  id: string

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  order: number
}
