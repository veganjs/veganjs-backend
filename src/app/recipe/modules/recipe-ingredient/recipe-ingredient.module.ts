import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity'
import { RecipeIngredientService } from './recipe-ingredient.service'

@Module({
  imports: [TypeOrmModule.forFeature([RecipeIngredientEntity])],
  providers: [RecipeIngredientService],
})
export class RecipeIngredientModule {}
