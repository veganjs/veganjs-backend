import { IsNotEmpty, IsUUID, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class IngredientDto {
  @IsUUID()
  @ApiProperty({ description: 'Ingredient id', format: 'uuid' })
  id: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Ingredient name' })
  name: string
}
