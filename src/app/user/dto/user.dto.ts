import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class User {
  @IsUUID()
  @ApiProperty({ format: 'uuid' })
  id: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string
}
