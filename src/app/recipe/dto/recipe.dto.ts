import {
  IsArray,
  IsUUID,
  IsString,
  IsNotEmpty,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { Category } from '../../category/dto/category.dto'
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

  @IsUUID()
  @ApiProperty()
  categoryId: string

  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    isArray: true,
    type: RecipeIngredientPayload,
  })
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientPayload)
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

  @ApiProperty()
  category: Category
}
