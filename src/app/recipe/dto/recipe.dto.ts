import {
  IsUUID,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  ArrayMinSize,
  IsNotEmpty,
  IsISO8601,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { DateISO } from '~/shared/types'

import { UserDto } from '../../user/dto/user.dto'
import { CategoryDto } from '../../category/dto/category.dto'
import { RecipeIngredientDto } from './recipe-ingredient/recipe-ingredient.dto'
import { StepDto } from './step/step.dto'
import { RecipeCommonDto } from './recipe-common.dto'

export class RecipeDto extends RecipeCommonDto {
  @IsUUID()
  @ApiProperty({ format: 'uuid', description: 'Recipe id' })
  id: string

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

  @ApiProperty({ type: CategoryDto })
  category: CategoryDto

  @ApiProperty({ type: UserDto })
  author: UserDto

  @IsNotEmpty()
  @IsISO8601()
  @ApiProperty({ description: 'Recipe creation date', format: 'date-time' })
  createdAt: DateISO

  @IsNotEmpty()
  @IsISO8601()
  @ApiProperty({ description: 'Recipe updation date', format: 'date-time' })
  updatedAt: DateISO
}
