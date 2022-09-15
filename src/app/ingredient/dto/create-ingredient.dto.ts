import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Ingredient name' })
  name: string
}
