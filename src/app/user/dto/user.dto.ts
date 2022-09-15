import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsISO8601, IsOptional } from 'class-validator'

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'User name' })
  username: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'User avatar' })
  avatar?: string

  @IsNotEmpty()
  @IsISO8601()
  @ApiProperty({ description: 'User account creation date' })
  createdAt: string
}
