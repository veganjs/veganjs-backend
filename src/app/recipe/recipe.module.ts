import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '../auth/auth.module'
import { IngredientService } from '../ingredient/ingredient.service'
import { IngredientEntity } from '../ingredient/entities/ingredient.entity'
import { CategoryEntity } from '../category/entities/category.entity'
import { UserEntity } from '../user/entities/user.entity'
import { CategoryService } from './../category/category.service'
import { UserService } from '../user/user.service'
import { FileService } from '../file/file.service'
import { RecipeEntity } from './entities/recipe.entity'
import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity'
import { RecipeController } from './recipe.controller'
import { RecipeService } from './recipe.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RecipeEntity,
      CategoryEntity,
      IngredientEntity,
      RecipeIngredientEntity,
    ]),
    AuthModule,
  ],
  controllers: [RecipeController],
  providers: [
    RecipeService,
    IngredientService,
    CategoryService,
    UserService,
    FileService,
  ],
})
export class RecipeModule {}
