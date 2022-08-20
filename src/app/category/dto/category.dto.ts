import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { CategoryTopic } from '../category.types'

export class CategoryDto {
  @IsNotEmpty()
  @IsEnum(CategoryTopic)
  @ApiProperty({ enum: CategoryTopic })
  name: CategoryTopic
}

export class Category {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  id: string

  @IsNotEmpty()
  @IsEnum(CategoryTopic)
  @ApiProperty({ enum: CategoryTopic })
  name: CategoryTopic
}
