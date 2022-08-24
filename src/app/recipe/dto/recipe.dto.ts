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

import { User } from '../../user/dto/user.dto'
import { Category } from '../../category/dto/category.dto'
import { RecipeIngredient, RecipeIngredientDto } from './recipe-ingredient.dto'

export class RecipeDto {
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
    type: RecipeIngredientDto,
  })
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  ingredients: RecipeIngredientDto[]
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

  @ApiProperty()
  author: User
}
