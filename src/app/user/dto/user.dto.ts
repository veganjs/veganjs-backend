import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class User {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string
}
