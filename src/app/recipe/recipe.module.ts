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
import { RecipeIngredientService } from './modules/recipe-ingredient/recipe-ingredient.service'
import { RecipeIngredientEntity } from './modules/recipe-ingredient/entities/recipe-ingredient.entity'
import { StepEntity } from './modules/step/entities/step.entity'
import { StepService } from './modules/step/step.service'
import { RecipeEntity } from './entities/recipe.entity'
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
