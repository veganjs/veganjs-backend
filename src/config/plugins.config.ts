import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import fastifyCors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyCsrf from '@fastify/csrf-protection'
import { join } from 'path'

export async function loadPlugins(app: NestFastifyApplication) {
  const configService = app.get(ConfigService)

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
  await app.register(fastifyCsrf)
  await app.register(fastifyHelmet)
}
