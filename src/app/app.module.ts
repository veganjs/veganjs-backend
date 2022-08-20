import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'

import { LoggingInterceptor, TransformInterceptor } from '~/shared/interceptors'
import { HttpExceptionFilter } from '~/shared/filters'

import { DatabaseModule } from '../config/database.module'
import { CategoryModule } from '../app/category/category.module'
import { IngredientModule } from '../app/ingredient/ingredient.module'
import { RecipeModule } from '../app/recipe/recipe.module'
import { UserModule } from '../app/user/user.module'
import { AuthModule } from '../app/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
    }),
    DatabaseModule,
    CategoryModule,
    IngredientModule,
    RecipeModule,
    UserModule,
    AuthModule,
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
