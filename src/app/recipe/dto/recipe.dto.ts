import {
  Min,
  IsUrl,
  IsUUID,
  IsArray,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  ArrayNotEmpty,
  ValidateNested,
  MaxLength,
  ArrayMinSize,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { User } from '../../user/dto/user.dto'
import { Category } from '../../category/dto/category.dto'
import { Step, StepDto } from '../modules/step/dto/step.dto'
import {
  RecipeIngredient,
  RecipeIngredientDto,
} from '../modules/recipe-ingredient/dto/recipe-ingredient.dto'

class RecipeCommon {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ description: 'Recipe title' })
  title: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @ApiProperty({ description: 'Recipe description' })
  description: string

  @IsNumber()
  @Min(1)
  @ApiProperty({
    minimum: 1,
    description: 'Number of servings a recipe will make',
  })
  servings: number

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Recipe original source' })
  source: string
}

export class RecipeDto extends RecipeCommon {
  @IsUUID()
  @ApiProperty({ description: 'Category id' })
  categoryId: string

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty({
    isArray: true,
    type: RecipeIngredientDto,
  })
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  ingredients: RecipeIngredientDto[]

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty({
    isArray: true,
    type: StepDto,
  })
  @ValidateNested({ each: true })
  @Type(() => StepDto)
  steps: StepDto[]
}

export class Recipe extends RecipeCommon {
  @IsUUID()
  @ApiProperty({ format: 'uuid', description: 'Recipe id' })
  id: string

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty({
    isArray: true,
    type: RecipeIngredient,
  })
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredient)
  ingredients: RecipeIngredient[]

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty({
    isArray: true,
    type: Step,
  })
  @ValidateNested({ each: true })
  @Type(() => Step)
  steps: Step[]

  @ApiProperty({ type: Category })
  category: Category

  @ApiProperty({ type: User })
  author: User
}
