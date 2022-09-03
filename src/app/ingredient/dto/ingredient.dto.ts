import { IsNotEmpty, IsUUID, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class IngredientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Ingredient name' })
  name: string
}

export class Ingredient extends IngredientDto {
  @IsUUID()
  @ApiProperty({ description: 'Ingredient id', format: 'uuid' })
  id: string
}
