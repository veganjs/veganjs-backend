import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm'

import { Filter, FilterOperator } from '../filter'
import { adaptFieldName, getUniqueParam } from '../lib'

interface WhereFiltersMeta {
  filters: Filter[]
}

type WhereCondition = [string, ObjectLiteral]

export function applyWhereFilters<T>(
  queryBuilder: SelectQueryBuilder<T>,
  meta: WhereFiltersMeta,
) {
  if (!meta.filters.length) {
    return queryBuilder
  }

  const whereConditions = meta.filters.map((filter) =>
    buildFilter(queryBuilder.alias, filter),
  )

  if (!whereConditions.length) {
    return queryBuilder
  }

  return queryBuilder.andWhere(
    new Brackets((qb) => {
      for (const condition of whereConditions) {
        const [where, parameters] = condition
        qb.andWhere(where, parameters)
      }
    }),
  )
}

function buildFilter(alias: string, filter: Filter) {
  let whereCondition: WhereCondition

  const field = adaptFieldName(alias, filter.field)
  const param = getUniqueParam(field)

  switch (filter.operator) {
    case FilterOperator.EQ:
      whereCondition = [
        `${field} = :${param}`,
        { [param]: filter.value as string | number },
      ]
      break
    case FilterOperator.NE:
      whereCondition = [
        `${field} != :${param}`,
        { [param]: filter.value as string | number },
      ]
      break
    case FilterOperator.IN:
      whereCondition = [
        `${field} IN (:...${param})`,
        { [param]: filter.value as Array<string | number> },
      ]
      break
    case FilterOperator.NIN:
      whereCondition = [
        `${field} NOT IN (:...${param})`,
        { [param]: filter.value as Array<string | number> },
      ]
      break
    case FilterOperator.NULL:
      whereCondition = [`${field} IS NULL`, null]
      break
    case FilterOperator.NNULL:
      whereCondition = [`${field} IS NOT NULL`, null]
      break
    case FilterOperator.LT:
      whereCondition = [
        `${field} < :${param}`,
        { [param]: filter.value as number },
      ]
      break
    case FilterOperator.LTE:
      whereCondition = [
        `${field} <= :${param}`,
        { [param]: filter.value as number },
      ]
      break
    case FilterOperator.GT:
      whereCondition = [
        `${field} > :${param}`,
        { [param]: filter.value as number },
      ]
      break
    case FilterOperator.GTE:
      whereCondition = [
        `${field} >= :${param}`,
        { [param]: filter.value as number },
      ]
      break
    default:
      throw new Error(`Unknown filter operator: ${filter.operator}`)
  }

  return whereCondition
}
