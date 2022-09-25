import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

import { Sort } from '../../types'

export class PaginationOptions {
  @IsEnum(Sort)
  @IsOptional()
  @ApiPropertyOptional({
    enum: Sort,
    default: Sort.ASC,
    description: 'Sort order',
  })
  readonly sort?: Sort = Sort.ASC

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    description: 'Current page',
  })
  readonly page?: number = 1

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  @ApiPropertyOptional({
    minimum: 1,
    default: 20,
    description: 'Records per page',
  })
  readonly limit?: number = 20

  get skip(): number {
    return (this.page - 1) * this.limit
  }
}
