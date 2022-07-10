import {
  Type,
  Injectable,
  ArgumentMetadata,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { validate, ValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'

@Injectable()
export class ValidationPipe<K> implements PipeTransform<K> {
  async transform<T>(value: T, { metatype }: ArgumentMetadata): Promise<T> {
    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException(
        'Validation failed: No body submitted',
        HttpStatus.BAD_REQUEST,
      )
    }

    if (!metatype || !this.shouldValidate(metatype)) {
      return value
    }

    const object = plainToClass(metatype, value, {
      enableImplicitConversion: true,
    })

    const errors = await validate(object, {
      whitelist: true,
      forbidUnknownValues: true,
    })

    if (errors.length > 0) {
      throw new HttpException(
        `Validation failed: ${this.formatErrors(errors)}`,
        HttpStatus.BAD_REQUEST,
      )
    }

    return value
  }

  private shouldValidate(metatype: Type<unknown>): boolean {
    const types: Type<unknown>[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }

  private formatErrors(errors: ValidationError[]): string {
    return errors.map((err) => Object.values(err.constraints)).join(', ')
  }

  private isEmpty<T>(value: T): boolean {
    return Object.keys(value).length === 0
  }
}
