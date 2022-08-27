import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsISO8601, IsOptional } from 'class-validator'

export class User {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  avatar?: string

  @IsNotEmpty()
  @IsISO8601()
  @ApiProperty()
  createdAt: string
}

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty()
  username?: string
}

export class UpdateUserDto extends UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  avatar?: string
}
