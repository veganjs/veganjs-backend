import { IsNotEmpty, IsUUID, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class IngredientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string
}

export class Ingredient extends IngredientDto {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  id: string
}
