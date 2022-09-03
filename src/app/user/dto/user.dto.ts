import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsISO8601, IsOptional } from 'class-validator'

export class User {
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

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'User name' })
  username?: string
}

export class UpdateUserDto extends UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'User avatar' })
  avatar?: string
}
