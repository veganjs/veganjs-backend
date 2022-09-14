import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TypeOrmExModule } from '~/shared/lib/typeorm-ex'

import { AuthModule } from '../auth/auth.module'
import { UserRepository } from '../user/repositories/user.repository'
import { IngredientService } from '../ingredient/ingredient.service'
import { IngredientEntity } from '../ingredient/entities/ingredient.entity'
import { CategoryEntity } from '../category/entities/category.entity'
import { CategoryService } from './../category/category.service'
import { UserService } from '../user/user.service'
import { FileService } from '../file/file.service'
import { RecipeIngredientService } from './modules/recipe-ingredient/recipe-ingredient.service'
import { RecipeIngredientEntity } from './modules/recipe-ingredient/entities/recipe-ingredient.entity'
import { StepEntity } from './modules/step/entities/step.entity'
import { StepService } from './modules/step/step.service'
import { RecipeEntity } from './entities/recipe.entity'
import { RecipeController } from './recipe.controller'
import { RecipeService } from './recipe.service'

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    TypeOrmModule.forFeature([
      RecipeEntity,
      CategoryEntity,
      IngredientEntity,
      RecipeIngredientEntity,
      StepEntity,
    ]),
    AuthModule,
  ],
  controllers: [RecipeController],
  providers: [
    RecipeService,
    IngredientService,
    RecipeIngredientService,
    CategoryService,
    UserService,
    FileService,
    StepService,
  ],
})
export class RecipeModule {}
