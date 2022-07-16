import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { IngredientService } from '../ingredient/ingredient.service'
import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity'
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

  private async getRecipeIngredient(
    ingredient: RecipeIngredientPayload,
    recipeId: string,
  ) {
    const recipeIngredient = new RecipeIngredientEntity()

    recipeIngredient.recipeId = recipeId
    recipeIngredient.amount = ingredient.amount
    recipeIngredient.unit = ingredient.unit
    recipeIngredient.ingredient =
      await this.ingredientsService.getIngredientById(ingredient.id)

    return await this.recipeIngredientRepository.save(recipeIngredient)
  }

  private async getRecipeIngredients(
    ingredients: RecipeIngredientPayload[],
    recipeId: string,
  ) {
    return Promise.all(
      ingredients.map((ingredient) =>
        this.getRecipeIngredient(ingredient, recipeId),
      ),
    )
  }

  // TODO: придумать способ как не сохранять рецепт если клиент отдал невалидные ингредиенты, пока хз
  async createRecipe(payload: RecipePayload) {
    const recipe = new RecipeEntity()

    recipe.title = payload.title
    recipe.description = payload.description

    const newRecipe = await this.recipeRepository.save(recipe)
    const ingredients = await this.getRecipeIngredients(
      payload.ingredients,
      newRecipe.id,
    )

    newRecipe.ingredients = ingredients

    return newRecipe
  }

  async deleteRecipe(id: string) {
    const result = await this.recipeRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }
}
