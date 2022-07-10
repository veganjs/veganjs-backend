import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

import { LoggingInterceptor } from '~/shared/interceptors'
import { HttpExceptionFilter } from '~/shared/filters'

import { DatabaseModule } from '../config/database.module'
import { CategoryModule } from '../app/category/category.module'
import { IngredientModule } from '../app/ingredient/ingredient.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoryModule,
    IngredientModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
