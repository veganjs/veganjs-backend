import { PipeTransform, Injectable } from '@nestjs/common'

@Injectable()
export class TrimPipe implements PipeTransform {
  transform<T>(value: T): T {
    if (typeof value === 'object') {
      Object.keys(value).forEach(
        (key) =>
          ((value as Record<string, unknown>)[key] = this.trim(
            value[key as keyof T],
          )),
      )
    }
    return value
  }

  private trim = (value: unknown) =>
    this.isString(value) ? value.trim() : value

  private isString(value: unknown): value is string {
    return typeof value === 'string'
  }
}
