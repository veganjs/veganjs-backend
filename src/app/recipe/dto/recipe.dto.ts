import {
  Min,
  Max,
  IsUrl,
  IsUUID,
  IsEnum,
  IsArray,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { User } from '../../user/dto/user.dto'
import { Category } from '../../category/dto/category.dto'
import { RecipeIngredient, RecipeIngredientDto } from './recipe-ingredient.dto'
import { TimeUnit } from '../recipe.types'

export class Time {
  @IsNumber()
  @Min(1)
  @Max(60)
  @ApiProperty({ minimum: 1, maximum: 60 })
  amount: number

  @IsNotEmpty()
  @IsEnum(TimeUnit)
  @ApiProperty({ enum: TimeUnit })
  unit: TimeUnit
}

class RecipeCommon {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string

  @IsNumber()
  @Min(1)
  @ApiProperty({ minimum: 1 })
  servings: number

  @ValidateNested()
  @Type(() => Time)
  @IsOptional()
  @ApiPropertyOptional()
  preparationTime: Time

  @ValidateNested()
  @Type(() => Time)
  @ApiProperty()
  cookingTime: Time

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional()
  source: string
}

export class RecipeDto extends RecipeCommon {
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

export class Recipe extends RecipeCommon {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  id: string

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
