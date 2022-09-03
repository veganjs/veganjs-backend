import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { CategoryTopic } from '../category.types'

export class CategoryDto {
  @IsNotEmpty()
  @IsEnum(CategoryTopic)
  @ApiProperty({ description: 'Category name', enum: CategoryTopic })
  name: CategoryTopic
}

export class Category extends CategoryDto {
  @IsUUID()
  @ApiProperty({ description: 'Category id', format: 'uuid' })
  id: string
}
