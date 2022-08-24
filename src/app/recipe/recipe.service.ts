import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Paginated, PaginationMeta, PaginationOptions } from '~/shared/types'

import { IngredientService } from '../ingredient/ingredient.service'
import { IngredientEntity } from '../ingredient/entities/ingredient.entity'
import { CategoryEntity } from '../category/entities/category.entity'
import { UserEntity } from '../user/entities/user.entity'
import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity'
import { RecipeEntity } from './entities/recipe.entity'
import { RecipeIngredientDto } from './dto/recipe-ingredient.dto'
import { RecipeDto } from './dto/recipe.dto'

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
    @InjectRepository(RecipeIngredientEntity)
    private readonly recipeIngredientRepository: Repository<RecipeIngredientEntity>,
    @Inject(IngredientService)
    private readonly ingredientService: IngredientService,
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
    const recipe = new RecipeEntity()

    const ingredientIds = payload.ingredients.map((ingredient) => ingredient.id)
    const ingredients = await this.ingredientService.getIngredientsByIds(
      ingredientIds,
    )

    const category = await this.categoryRepository.findOne({
      where: { id: payload.categoryId },
    })
    const user = await this.userRepository.findOne({
      where: { id: userId },
    })

    if (!ingredients.length) {
      throw new NotFoundException('Ingredients not found')
    }

    recipe.title = payload.title
    recipe.description = payload.description
    recipe.category = category ?? null
    recipe.author = user ?? null

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
      throw new NotFoundException('Recipe not found')
    }
  }
}
