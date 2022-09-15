import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { Path } from './constants.config'

export function setupSwagger(app: NestFastifyApplication) {
  const options = new DocumentBuilder()
    .setTitle('Veganjs cookbook API')
    .setVersion('1.0')
    .addCookieAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(Path.Documentation, app, document)
}
