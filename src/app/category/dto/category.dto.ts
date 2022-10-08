import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { CategoryTopic } from '../category.constants'

export class CategoryDto {
  @IsUUID()
  @ApiProperty({ description: 'Category id', format: 'uuid' })
  id: string

  @IsNotEmpty()
  @IsEnum(CategoryTopic)
  @ApiProperty({ description: 'Category name', enum: CategoryTopic })
  name: CategoryTopic
}
