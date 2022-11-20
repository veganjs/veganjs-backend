import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { writeFileSync } from 'fs'
import * as yaml from 'yaml'

import { Path } from './constants.config'

export function setupSwagger(app: NestFastifyApplication) {
  const options = new DocumentBuilder()
    .setTitle('Veganjs cookbook API')
    .setVersion('1.0')
    .addCookieAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)

  writeFileSync('./docs/swagger-spec.yaml', yaml.stringify(document))
  SwaggerModule.setup(Path.Documentation, app, document)
}
