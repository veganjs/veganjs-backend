import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

import { UpdateProfileDto } from './update-profile.dto'

export class UpdateUserDto extends UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'User avatar' })
  avatar?: string
}
