import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TypeOrmExModule } from '~/shared/lib/typeorm-ex'

import { AuthModule } from '../auth/auth.module'
import { SearchModule } from '../search/search.module'
import IngredientSearchService from '../ingredient/ingredient-search.service'
import { UserRepository } from '../user/repositories/user.repository'
import { IngredientService } from '../ingredient/ingredient.service'
import { IngredientEntity } from '../ingredient/entities/ingredient.entity'
import { CategoryEntity } from '../category/entities/category.entity'
import { CategoryService } from './../category/category.service'
import { UserService } from '../user/user.service'
import { FileService } from '../file/file.service'
import { RecipeIngredientRepository } from './repositories/recipe-ingredient.repository'
import { StepRepository } from './repositories/step.repository'
import { RecipeEntity } from './entities/recipe.entity'
import { RecipeController } from './recipe.controller'
import { RecipeService } from './recipe.service'

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      StepRepository,
      RecipeIngredientRepository,
    ]),
    TypeOrmModule.forFeature([RecipeEntity, CategoryEntity, IngredientEntity]),
    SearchModule,
    AuthModule,
  ],
  controllers: [RecipeController],
  providers: [
    RecipeService,
    IngredientService,
    CategoryService,
    UserService,
    FileService,
    IngredientSearchService,
  ],
})
export class RecipeModule {}
