import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { PrismaModule } from 'nestjs-prisma'

import { configuration, validationSchema } from '~/config'
import { LoggingInterceptor, TransformInterceptor } from '~/shared/interceptors'

import { CategoryModule } from './category/category.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema,
      load: [configuration],
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    CategoryModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
