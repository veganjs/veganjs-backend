import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import fastifyStatic from '@fastify/static'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyCsrf from '@fastify/csrf-protection'
import fastifyMultipart from '@fastify/multipart'
import { join } from 'path'

import { publicPath } from '../app/file/file.constants'

export async function loadPlugins(app: NestFastifyApplication) {
  const configService = app.get(ConfigService)

  await app.register(fastifyCors, {
    credentials: true,
    origin: configService.get<string>('CORS_ORIGIN'),
  })
  await app.register(fastifyStatic, {
    root: join(process.cwd(), publicPath),
    prefix: `/${publicPath}/`,
    cacheControl: true,
  })
  await app.register(fastifyMultipart)
  await app.register(fastifyRateLimit, {
    max: 20,
    timeWindow: '1 minute',
  })
  await app.register(fastifyCookie, {
    secret: configService.get<string>('COOKIE_SECRET'),
  })
  await app.register(fastifyCsrf)
  await app.register(fastifyHelmet)
}
