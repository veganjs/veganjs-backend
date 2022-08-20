import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function setupSwagger(app: NestFastifyApplication) {
  const options = new DocumentBuilder()
    .setTitle('Veganjs cookbook API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        in: 'header',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
      },
      'access-token',
    )
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api/swagger', app, document)
}
