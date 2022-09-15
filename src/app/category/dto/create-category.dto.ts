import { IsNotEmpty, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { CategoryTopic } from '../category.types'

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsEnum(CategoryTopic)
  @ApiProperty({ description: 'Category name', enum: CategoryTopic })
  name: CategoryTopic
}
