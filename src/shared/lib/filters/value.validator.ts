import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'filter-value', async: false })
export class IsFilterValue implements ValidatorConstraintInterface {
  validate(value: unknown) {
    return (
      value === null ||
      typeof value === 'number' ||
      typeof value === 'string' ||
      (Array.isArray(value) &&
        value.every((v) => typeof v === 'string' || typeof v === 'number'))
    )
  }

  defaultMessage() {
    return '($value) must be a number or a string or an array of strings/numbers'
  }
}
