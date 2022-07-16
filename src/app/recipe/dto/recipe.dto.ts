import {
  IsArray,
  IsUUID,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import {
  RecipeIngredient,
  RecipeIngredientPayload,
} from './recipe-ingredient.dto'

export class RecipePayload {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string

  @IsArray()
  @ApiProperty({
    isArray: true,
    type: RecipeIngredientPayload,
  })
  @ValidateNested({ each: true })
  ingredients: RecipeIngredientPayload[]
}

export class Recipe {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  id: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string

  @IsArray()
  @ApiProperty({
    isArray: true,
    type: RecipeIngredient,
  })
  ingredients: RecipeIngredient[]
}
