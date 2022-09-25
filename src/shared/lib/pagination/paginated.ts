import { ApiProperty } from '@nestjs/swagger'
import { IsArray } from 'class-validator'

import { PaginationMeta } from './meta'

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
