import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class LoginCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User name' })
  username: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User password' })
  password: string
}
