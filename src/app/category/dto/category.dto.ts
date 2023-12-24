import { CategoryTopic } from '@prisma/client'
import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CategoryDto {
  @IsUUID()
  @ApiProperty({ description: 'Category id', format: 'uuid' })
  id: string

  @IsNotEmpty()
  @IsEnum(CategoryTopic)
  @ApiProperty({ description: 'Category name', enum: CategoryTopic })
  name: CategoryTopic
}
