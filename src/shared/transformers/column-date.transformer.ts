export class ColumnDateTransformer {
  from(value?: Date | null): string | Date {
    return value === undefined || value === null ? value : value.toISOString()
  }
  to(value?: string | null): string | Date {
    return value === undefined || value === null ? value : new Date(value)
  }
}
