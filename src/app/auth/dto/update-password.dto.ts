import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Old password' })
  oldPassword: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'newPassword is too weak',
  })
  @ApiProperty({ description: 'New password' })
  newPassword: string
}
