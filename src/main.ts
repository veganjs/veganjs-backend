import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import fastifyCors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import fastifyCookie from '@fastify/cookie'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyCsrf from '@fastify/csrf-protection'
import { join } from 'path'

import { TrimPipe, ValidationPipe } from '~/shared/pipes'

import { AppModule } from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  )

  const configService = app.get(ConfigService)

  app.setGlobalPrefix('api')

  app.useGlobalPipes(new TrimPipe())
  app.useGlobalPipes(new ValidationPipe())

  await app.register(fastifyCors, {
    credentials: true,
    origin: configService.get<string>('CORS_ORIGIN'),
  })
  await app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public'),
  })
  await app.register(fastifyRateLimit, {
    max: 20,
    timeWindow: '1 minute',
  })
  await app.register(fastifyCookie, {
    secret: configService.get<string>('COOKIE_SECRET'),
  })
  await app.register(fastifyCsrf)
  await app.register(fastifyHelmet)

  const options = new DocumentBuilder()
    .setTitle('Veganjs API')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api/swagger', app, document)

  await app.listen(8000)
}

bootstrap()
