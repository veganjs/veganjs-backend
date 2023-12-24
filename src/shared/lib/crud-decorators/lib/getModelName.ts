import { Type } from '@nestjs/common'

export function getModelName<Model extends Type<unknown>>(
  model: Model,
  postfix = 'Entity',
) {
  return model.name.endsWith(postfix)
    ? model.name.replace(postfix, '')
    : model.name
}
