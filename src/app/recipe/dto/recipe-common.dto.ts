import {
  Min,
  IsUrl,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class RecipeCommonDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ description: 'Recipe title' })
  title: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @ApiProperty({ description: 'Recipe description' })
  description: string

  @IsNumber()
  @Min(1)
  @ApiProperty({
    minimum: 1,
    description: 'Number of servings a recipe will make',
  })
  servings: number

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Recipe original source' })
  source: string
}
