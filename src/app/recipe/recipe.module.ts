import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IngredientService } from '../ingredient/ingredient.service'
import { IngredientEntity } from '../ingredient/entities/ingredient.entity'
import { CategoryEntity } from '../category/entities/category.entity'
import { RecipeEntity } from './entities/recipe.entity'
import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity'
import { RecipeController } from './recipe.controller'
import { RecipeService } from './recipe.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipeEntity,
      CategoryEntity,
      IngredientEntity,
      RecipeIngredientEntity,
    ]),
  ],
  controllers: [RecipeController],
  providers: [RecipeService, IngredientService],
})
export class RecipeModule {}
