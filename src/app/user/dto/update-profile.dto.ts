import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'User name' })
  username?: string
}
