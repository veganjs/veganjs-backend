import { Brackets, SelectQueryBuilder } from 'typeorm'

import { NonEmptyArray } from '../../../types'
import { adaptFieldName, getUniqueParam } from '../lib'

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

  const searchFields = meta.searchFields.map((fieldName) =>
    adaptFieldName(queryBuilder.alias, fieldName),
  )

  return queryBuilder.andWhere(
    new Brackets((qb) => {
      for (const field of searchFields) {
        const param = getUniqueParam(field)
        qb.orWhere(`LOWER (${field}) LIKE LOWER (:${param})`, {
          [param]: `%${meta.query}%`,
        })
      }
    }),
  )
}
