import { Repository } from 'typeorm'

import { CustomRepository } from '~/shared/lib/typeorm-ex'

import { IngredientEntity } from '../../ingredient/entities/ingredient.entity'
import { CreateRecipeIngredientDto } from '../dto/recipe-ingredient/create-recipe-ingredient.dto'
import { RecipeIngredientEntity } from '../entities/recipe-ingredient.entity'

@CustomRepository(RecipeIngredientEntity)
export class RecipeIngredientRepository extends Repository<RecipeIngredientEntity> {
  private prepareRecipeIngredient(
    ingredientPayload: CreateRecipeIngredientDto,
    ingredient: IngredientEntity,
    recipeId: string,
  ) {
    const recipeIngredient = new RecipeIngredientEntity()

    recipeIngredient.recipeId = recipeId
    recipeIngredient.amount = ingredientPayload.amount
    recipeIngredient.unit = ingredientPayload.unit
    recipeIngredient.ingredient = ingredient

    return recipeIngredient
  }

  async createRecipeIngredients(
    ingredientsPayload: CreateRecipeIngredientDto[],
    ingredients: IngredientEntity[],
    recipeId: string,
  ) {
    const recipeIngredients = ingredients.map((ingredient) => {
      const ingredientPayload = ingredientsPayload.find(
        (payload) => ingredient.id === payload.id,
      )
      return this.prepareRecipeIngredient(
        ingredientPayload,
        ingredient,
        recipeId,
      )
    })
    return this.save(recipeIngredients)
  }
}
