import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

import { AppModule } from '~/app/app.module'
import { apiPrefix, docPrefix } from '~/config/constants.config'
import { setupSwagger } from '~/config/swagger.config'
import { loadPlugins } from '~/config/plugins.config'
import { TrimPipe } from '~/shared/pipes'

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  )

  const configService = app.get(ConfigService)

  const port = configService.get<string>('PORT')
  const host = configService.get<string>('HOST_NAME')

  app.setGlobalPrefix(apiPrefix)

  app.useGlobalPipes(new TrimPipe())
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  loadPlugins(app)
  setupSwagger(app)

  await app.listen(port)

  logger.log(`🚀 API app is running on: ${host}:${port}/${apiPrefix}`)
  logger.log(`📑 API documentation is running on: ${host}:${port}/${docPrefix}`)
}

bootstrap()
