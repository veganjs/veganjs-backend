import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

import { LoggingInterceptor, TransformInterceptor } from '~/shared/interceptors'
import { HttpExceptionFilter } from '~/shared/filters'

import { configuration } from '../config/env.config'
import { DatabaseModule } from '../config/database.module'
import { CategoryModule } from './category/category.module'
import { IngredientModule } from './ingredient/ingredient.module'
import { RecipeModule } from './recipe/recipe.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { FileModule } from './file/file.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
    }),
    DatabaseModule,
    CategoryModule,
    IngredientModule,
    RecipeModule,
    UserModule,
    AuthModule,
    FileModule,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
