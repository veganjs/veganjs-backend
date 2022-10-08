import {
  IsUUID,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { CreateRecipeIngredientDto } from './recipe-ingredient/create-recipe-ingredient.dto'
import { CreateStepDto } from './step/create-step.dto'
import { RecipeCommonDto } from './recipe-common.dto'

export class CreateRecipeDto extends RecipeCommonDto {
  @IsUUID()
  @ApiProperty({ description: 'Category id', format: 'uuid' })
  categoryId: string

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty({
    isArray: true,
    type: CreateRecipeIngredientDto,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredients: CreateRecipeIngredientDto[]

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty({
    isArray: true,
    type: CreateStepDto,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  steps: CreateStepDto[]
}
