import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, Max, Min, IsArray } from 'class-validator'
import { Type } from 'class-transformer'

import { Sort } from './sort'

export class PaginationOptions {
  @ApiPropertyOptional({ enum: Sort, default: Sort.ASC })
  @IsEnum(Sort)
  @IsOptional()
  readonly sort?: Sort = Sort.ASC

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly limit?: number = 20

  get skip(): number {
    return (this.page - 1) * this.limit
  }
}

interface PaginationMetaParams {
  options: PaginationOptions
  totalCount: number
}

export class PaginationMeta {
  @ApiProperty()
  readonly page: number

  @ApiProperty()
  readonly limit: number

  @ApiProperty()
  readonly totalCount: number

  @ApiProperty()
  readonly pagesCount: number

  @ApiProperty()
  readonly hasPreviousPage: boolean

  @ApiProperty()
  readonly hasNextPage: boolean

  constructor({ options, totalCount }: PaginationMetaParams) {
    this.page = options.page
    this.limit = options.limit
    this.totalCount = totalCount
    this.pagesCount = Math.ceil(this.totalCount / this.limit)
    this.hasPreviousPage = this.page > 1
    this.hasNextPage = this.page < this.pagesCount
  }
}

export class Paginated<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[]

  @ApiProperty({ type: () => PaginationMeta })
  readonly meta: PaginationMeta

  constructor(data: T[], meta: PaginationMeta) {
    this.data = data
    this.meta = meta
  }
}
