import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IngredientEntity } from '../ingredient/entities/ingredient.entity'
import { IngredientService } from '../ingredient/ingredient.service'
import { RecipeController } from './recipe.controller'
import { RecipeService } from './recipe.service'
import { RecipeEntity } from './entities/recipe.entity'
import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipeEntity,
      RecipeIngredientEntity,
      IngredientEntity,
    ]),
  ],
  controllers: [RecipeController],
  providers: [RecipeService, IngredientService],
})
export class RecipeModule {}
