import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, Max, Min, IsArray } from 'class-validator'
import { Type } from 'class-transformer'

import { Sort } from './sort'

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

interface PaginationMetaParams {
  options: PaginationOptions
  totalCount: number
}

export class PaginationMeta {
  @ApiProperty({ minimum: 1, default: 1, description: 'Current page' })
  readonly page: number

  @ApiProperty({ minimum: 1, default: 20, description: 'Records per page' })
  readonly limit: number

  @ApiProperty({ description: 'Total records count' })
  readonly totalCount: number

  @ApiProperty({ description: 'Total pages count' })
  readonly pagesCount: number

  @ApiProperty({
    description: 'Whether current entity has a previous page to be shown',
  })
  readonly hasPreviousPage: boolean

  @ApiProperty({
    description: 'Whether current entity has a next page to be shown',
  })
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
  @ApiProperty({ isArray: true, description: 'Paginated data' })
  readonly data: T[]

  @ApiProperty({ type: PaginationMeta })
  readonly meta: PaginationMeta

  constructor(data: T[], meta: PaginationMeta) {
    this.data = data
    this.meta = meta
  }
}
