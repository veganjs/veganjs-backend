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

import { MeasureUnit } from '../recipe.types'
import { Ingredient } from './../../ingredient/dto/ingredient.dto'

export class RecipeIngredient {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ format: 'uuid' })
  id: string

  @IsNumber()
  @Min(0)
  @ApiProperty({ minimum: 0 })
  amount: number

  @IsOptional()
  @IsEnum(MeasureUnit)
  @ApiPropertyOptional({ enum: MeasureUnit })
  unit: MeasureUnit

  @ApiProperty()
  ingredient: Ingredient
}

export class RecipeIngredientPayload {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ format: 'uuid' })
  id: string

  @IsNumber()
  @Min(0)
  @ApiProperty({ minimum: 0 })
  amount: number

  @IsOptional()
  @IsEnum(MeasureUnit)
  @ApiPropertyOptional({ enum: MeasureUnit })
  unit: MeasureUnit
}
