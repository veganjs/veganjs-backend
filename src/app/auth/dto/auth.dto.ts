import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

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

export class SignUpCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({ description: 'User name' })
  username: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  @ApiProperty({ description: 'User password' })
  password: string
}
