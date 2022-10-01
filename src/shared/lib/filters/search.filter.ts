import { Brackets, SelectQueryBuilder } from 'typeorm'

import { NonEmptyArray } from '../../types'

interface SearchFilterMeta {
  query: string
  searchFields: NonEmptyArray<string>
}

export function applySearchFilter<T>(
  queryBuilder: SelectQueryBuilder<T>,
  meta: SearchFilterMeta,
) {
  if (!meta.query) {
    return queryBuilder
  }

  const searchFields = meta.searchFields.map(
    (field) => `${queryBuilder.alias}.${field}`,
  )

  return queryBuilder.andWhere(
    new Brackets((qb) => {
      for (const field of searchFields) {
        qb.orWhere(`LOWER(${field}) LIKE LOWER(:query)`, {
          query: `%${meta.query}%`,
        })
      }
    }),
  )
}
