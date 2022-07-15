import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

import { AppModule } from '~/app/app.module'
import { TrimPipe, ValidationPipe } from '~/shared/pipes'
import { setupSwagger } from '~/config/swagger.config'
import { loadPlugins } from '~/config/plugins.config'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  )

  app.setGlobalPrefix('api')

  app.useGlobalPipes(new TrimPipe())
  app.useGlobalPipes(new ValidationPipe())

  loadPlugins(app)
  setupSwagger(app)

  await app.listen(8000)
}

bootstrap()
