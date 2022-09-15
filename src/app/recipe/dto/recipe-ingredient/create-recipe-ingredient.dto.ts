import {
  Min,
  IsEnum,
  IsUUID,
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { MeasureUnit } from '../../recipe.types'

export class CreateRecipeIngredientDto {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Recipe ingredient id', format: 'uuid' })
  id: string

  @IsNumber()
  @Min(1)
  @ApiProperty({
    minimum: 1,
    description: 'Quantity of certain ingredient needed for recipe',
  })
  amount: number

  @IsOptional()
  @IsEnum(MeasureUnit)
  @ApiPropertyOptional({
    enum: MeasureUnit,
    description: 'Recipe ingredient measure unit',
  })
  unit: MeasureUnit
}
