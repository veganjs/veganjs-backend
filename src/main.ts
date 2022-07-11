import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
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

import { AppModule } from '~/app/app.module'
import { TrimPipe, ValidationPipe } from '~/shared/pipes'
import { setupSwagger } from '~/config/swagger.config'

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

  setupSwagger(app)

  await app.listen(8000)
}

bootstrap()
