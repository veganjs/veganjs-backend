import { ApiProperty } from '@nestjs/swagger'

import { PaginationOptions } from './options'

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
