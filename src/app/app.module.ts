import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

import { LoggingInterceptor, TransformInterceptor } from '~/shared/interceptors'
import { HttpExceptionFilter } from '~/shared/filters'

import { configuration } from '../config/env.config'
import { validationSchema } from '../config/validation.schema'
import { DatabaseModule } from '../config/database.module'
import { CategoryModule } from './category/category.module'
import { IngredientModule } from './ingredient/ingredient.module'
import { StepsModule } from './recipe/modules/step/step.module'
import { RecipeIngredientModule } from './recipe/modules/recipe-ingredient/recipe-ingredient.module'
import { RecipeModule } from './recipe/recipe.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { FileModule } from './file/file.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema,
      load: [configuration],
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
    }),
    DatabaseModule,
    CategoryModule,
    IngredientModule,
    RecipeModule,
    RecipeIngredientModule,
    UserModule,
    AuthModule,
    FileModule,
    StepsModule,
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
