import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { IngredientService } from '../ingredient/ingredient.service'
import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity'
import { IngredientEntity } from '../ingredient/entities/ingredient.entity'
import { RecipeEntity } from './entities/recipe.entity'
import { RecipePayload } from './dto/recipe.dto'
import { RecipeIngredientPayload } from './dto/recipe-ingredient.dto'

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private recipeRepository: Repository<RecipeEntity>,
    @InjectRepository(RecipeIngredientEntity)
    private recipeIngredientRepository: Repository<RecipeIngredientEntity>,
    @Inject(IngredientService)
    private ingredientsService: IngredientService,
  ) {}

  async getAllRecipes() {
    return await this.recipeRepository.find({
      relations: ['ingredients', 'ingredients.ingredient'],
    })
  }

  async getRecipeById(id: string) {
    return await this.recipeRepository.findOne({
      where: { id },
      relations: ['ingredients', 'ingredients.ingredient'],
    })
  }

  private async saveRecipeIngredient(
    ingredientPayload: RecipeIngredientPayload,
    ingredient: IngredientEntity,
    recipeId: string,
  ) {
    const recipeIngredient = new RecipeIngredientEntity()

    recipeIngredient.recipeId = recipeId
    recipeIngredient.amount = ingredientPayload.amount
    recipeIngredient.unit = ingredientPayload.unit
    recipeIngredient.ingredient = ingredient

    return await this.recipeIngredientRepository.save(recipeIngredient)
  }

  private async saveRecipeIngredients(
    ingredientsPayload: RecipeIngredientPayload[],
    ingredients: IngredientEntity[],
    recipeId: string,
  ) {
    return Promise.all(
      ingredients.map((ingredient) => {
        const ingredientDto = ingredientsPayload.find(
          (payload) => ingredient.id === payload.id,
        )
        return this.saveRecipeIngredient(ingredientDto, ingredient, recipeId)
      }),
    )
  }

  async createRecipe(payload: RecipePayload) {
    const recipe = new RecipeEntity()

    const ingredientIds = payload.ingredients.map((ingredient) => ingredient.id)
    const ingredients = await this.ingredientsService.getIngredientsByIds(
      ingredientIds,
    )

    if (!ingredients.length) {
      throw new NotFoundException()
    }

    recipe.title = payload.title
    recipe.description = payload.description

    const newRecipe = await this.recipeRepository.save(recipe)

    newRecipe.ingredients = await this.saveRecipeIngredients(
      payload.ingredients,
      ingredients,
      newRecipe.id,
    )

    return newRecipe
  }

  async deleteRecipe(id: string) {
    const result = await this.recipeRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }
}
