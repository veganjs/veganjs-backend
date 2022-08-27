import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Paginated, PaginationMeta, PaginationOptions } from '~/shared/types'

import { IngredientService } from '../ingredient/ingredient.service'
import { IngredientEntity } from '../ingredient/entities/ingredient.entity'
import { CategoryService } from '../category/category.service'
import { UserService } from './../user/user.service'
import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity'
import { RecipeEntity } from './entities/recipe.entity'
import { RecipeIngredientDto } from './dto/recipe-ingredient.dto'
import { RecipeDto } from './dto/recipe.dto'
import { mapCreateRecipe } from './lib/mapRecipe'

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
    @InjectRepository(RecipeIngredientEntity)
    private readonly recipeIngredientRepository: Repository<RecipeIngredientEntity>,
    @Inject(IngredientService)
    private readonly ingredientService: IngredientService,
    @Inject(CategoryService)
    private readonly categoryService: CategoryService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async getAllRecipes(query: string, options: PaginationOptions) {
    const queryBuilder = this.recipeRepository.createQueryBuilder('recipe')

    queryBuilder
      .skip(options.skip)
      .take(options.limit)
      .leftJoinAndSelect('recipe.category', 'category')
      .leftJoinAndSelect('recipe.author', 'author')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('ingredients.ingredient', 'ingredient')
      .orderBy('recipe.title', options.sort)

    if (query) {
      queryBuilder.where('LOWER(recipe.title) LIKE LOWER(:query)', {
        query: `%${query}%`,
      })
    }

    const totalCount = await queryBuilder.getCount()
    const { entities } = await queryBuilder.getRawAndEntities()

    const meta = new PaginationMeta({ totalCount, options })
    return new Paginated(entities, meta)
  }

  async getRecipeById(id: string) {
    return await this.recipeRepository.findOne({
      where: { id },
      relations: ['ingredients', 'ingredients.ingredient'],
    })
  }

  private async saveRecipeIngredient(
    ingredientPayload: RecipeIngredientDto,
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
    ingredientsPayload: RecipeIngredientDto[],
    ingredients: IngredientEntity[],
    recipeId: string,
  ) {
    return Promise.all(
      ingredients.map((ingredient) => {
        const ingredientPayload = ingredientsPayload.find(
          (payload) => ingredient.id === payload.id,
        )
        return this.saveRecipeIngredient(
          ingredientPayload,
          ingredient,
          recipeId,
        )
      }),
    )
  }

  async createRecipe(payload: RecipeDto, userId: string) {
    const ingredientIds = payload.ingredients.map((ingredient) => ingredient.id)
    const ingredients = await this.ingredientService.getIngredientsByIds(
      ingredientIds,
    )

    const user = await this.userService.getUserById(userId)
    const category = await this.categoryService.getCategoryById(
      payload.categoryId,
    )

    if (!ingredients.length) {
      throw new NotFoundException('Ingredients not found')
    }

    const recipe = mapCreateRecipe(payload, category, user)
    const newRecipe = await this.recipeRepository.save(recipe)

    newRecipe.ingredients = await this.saveRecipeIngredients(
      payload.ingredients,
      ingredients,
      newRecipe.id,
    )

    return newRecipe
  }

  async deleteRecipe(id: string) {
    const recipe = await this.recipeRepository.delete(id)
    if (recipe.affected === 0) {
      throw new NotFoundException('Recipe not found')
    }
  }
}
