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
import {
  RecipeIngredient,
  RecipeIngredientDto,
} from '../modules/recipe-ingredient/dto/recipe-ingredient.dto'
import { Step, StepDto } from '../modules/step/dto/step.dto'

class RecipeCommon {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty()
  title: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @ApiProperty()
  description: string

  @IsNumber()
  @Min(1)
  @ApiProperty({ minimum: 1 })
  servings: number

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
  @ApiProperty({ format: 'uuid' })
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

  @ApiProperty()
  category: Category

  @ApiProperty()
  author: User
}
