import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class Ingredient {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string
}
