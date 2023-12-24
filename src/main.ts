import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClientExceptionFilter } from 'nestjs-prisma'

import { Path, loadPlugins, setupSwagger } from '~/config'
import { TrimPipe } from '~/shared/pipes'

import { AppModule } from './app/app.module'

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  const port = configService.get<string>('PORT')
  const host = configService.get<string>('HOST_NAME')

  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  })

  app.setGlobalPrefix(Path.Api)

  app.useGlobalPipes(new TrimPipe())
  /**
   * whitelist: removes all properties of a request’s body which are not in the DTO
   * transform: allows us to transform properties, i.e., an integer to a string
   */
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

  loadPlugins(app)

  if (configService.get<string>('NODE_ENV') === 'development') {
    setupSwagger(app)
  }

  await app.listen(port)

  logger.log(`🚀 API app is running on: ${host}:${port}/${Path.Api}`)
  logger.log(
    `📑 API documentation is running on: ${host}:${port}/${Path.Documentation}`,
  )
}

bootstrap()
