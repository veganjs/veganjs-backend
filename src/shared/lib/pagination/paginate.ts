import { SelectQueryBuilder } from 'typeorm'

import { PaginationMeta } from './meta'
import { PaginationOptions } from './options'
import { Paginated } from './paginated'

export async function paginate(
  options: PaginationOptions,
): Promise<Paginated<unknown>>

export async function paginate<T>(
  options: PaginationOptions,
  queryBuilder: SelectQueryBuilder<T>,
): Promise<Paginated<T>>

export async function paginate<T>(
  options: PaginationOptions,
  queryBuilder?: SelectQueryBuilder<T>,
) {
  if (queryBuilder) {
    const totalCount = await queryBuilder.getCount()
    const { entities } = await queryBuilder.getRawAndEntities()

    const meta = new PaginationMeta({ totalCount, options })
    return new Paginated(entities, meta)
  }

  const meta = new PaginationMeta({ totalCount: 0, options })
  return new Paginated([], meta)
}
