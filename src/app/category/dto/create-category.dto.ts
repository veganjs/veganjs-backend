import { CategoryTopic } from '@prisma/client'
import { IsNotEmpty, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsEnum(CategoryTopic)
  @ApiProperty({ description: 'Category name', enum: CategoryTopic })
  name: CategoryTopic
}
