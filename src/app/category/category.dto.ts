import { IsNotEmpty, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { CategoryTopic } from './category.types'

export class Category {
  @IsNotEmpty()
  @IsEnum(CategoryTopic)
  @ApiProperty({ enum: CategoryTopic })
  topic: CategoryTopic
}
