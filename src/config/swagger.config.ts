import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { docPrefix } from './constants.config'

export function setupSwagger(app: NestFastifyApplication) {
  const options = new DocumentBuilder()
    .setTitle('Veganjs cookbook API')
    .setVersion('1.0')
    .addCookieAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(docPrefix, app, document)
}
