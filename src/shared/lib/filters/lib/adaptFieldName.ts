/**
 * Tries to adapt field name for using in query builder to avoid mistakes in field paths
 * For example "id" field name will be adapted to "entityAlias.id"
 * or "entityAlias.nestedAlias.id" will be adapted to "nestedAlias.id"
 */
export function adaptFieldName(alias: string, fieldName: string) {
  const qbAlias = `${alias}.`
  const fieldNameWithoutAlias = fieldName.replace(qbAlias, '')

  if (fieldNameWithoutAlias.includes('.')) {
    return fieldNameWithoutAlias
  } else {
    return `${qbAlias}${fieldNameWithoutAlias}`
  }
}
