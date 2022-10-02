import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator'

import { IsFilterValue } from './value.validator'

export enum FilterOperator {
  EQ = 'EQ',
  NE = 'NE',
  IN = 'IN',
  NIN = 'NIN',
  NULL = 'NULL',
  NNULL = 'NNULL',
  LT = 'LT',
  LTE = 'LTE',
  GT = 'GT',
  GTE = 'GTE',
}

export class Filter {
  @IsString()
  @ApiProperty({ description: 'Field for filtering', example: 'servings' })
  field: string

  @IsEnum(FilterOperator)
  @ApiProperty({
    description: 'Filter operator',
    enum: FilterOperator,
    example: FilterOperator.GTE,
  })
  operator: FilterOperator

  @Validate(IsFilterValue)
  @ApiProperty({
    description: 'Filter value',
    example: 4,
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'null' },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      {
        type: 'array',
        items: {
          type: 'number',
        },
      },
    ],
  })
  value: string | number | null | Array<string | number>
}

export class Filters {
  @IsArray()
  @ApiProperty({ type: Filter, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => Filter)
  filters: Filter[]
}
