import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { IngredientEntity } from '../../../ingredient/entities/ingredient.entity'
import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity'
import { RecipeIngredientDto } from './dto/recipe-ingredient.dto'

@Injectable()
export class RecipeIngredientService {
  constructor(
    @InjectRepository(RecipeIngredientEntity)
    private readonly recipeIngredientRepository: Repository<RecipeIngredientEntity>,
  ) {}

  private prepareRecipeIngredient(
    ingredientPayload: RecipeIngredientDto,
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
    ingredientsPayload: RecipeIngredientDto[],
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
    return this.recipeIngredientRepository.save(recipeIngredients)
  }
}
