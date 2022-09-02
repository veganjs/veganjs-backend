import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Paginated, PaginationMeta, PaginationOptions } from '~/shared/types'

import { IngredientService } from '../ingredient/ingredient.service'
import { CategoryService } from '../category/category.service'
import { UserService } from './../user/user.service'
import { RecipeEntity } from './entities/recipe.entity'
import { RecipeIngredientService } from './modules/recipe-ingredient/recipe-ingredient.service'
import { StepService } from './modules/step/step.service'
import { RecipeDto } from './dto/recipe.dto'

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
    @Inject(IngredientService)
    private readonly ingredientService: IngredientService,
    @Inject(RecipeIngredientService)
    private readonly recipeIngredientService: RecipeIngredientService,
    @Inject(CategoryService)
    private readonly categoryService: CategoryService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(StepService)
    private readonly stepService: StepService,
  ) {}

  async getAllRecipes(query: string, options: PaginationOptions) {
    const queryBuilder = this.recipeRepository.createQueryBuilder('recipe')

    queryBuilder
      .skip(options.skip)
      .take(options.limit)
      .leftJoinAndSelect('recipe.category', 'category')
      .leftJoinAndSelect('recipe.author', 'author')
      .leftJoinAndSelect('recipe.steps', 'steps')
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

    const recipe = new RecipeEntity()

    recipe.title = payload.title
    recipe.description = payload.description
    recipe.source = payload.source
    recipe.servings = payload.servings
    recipe.category = category
    recipe.author = user

    const newRecipe = await this.recipeRepository.save(recipe)

    newRecipe.ingredients =
      await this.recipeIngredientService.createRecipeIngredients(
        payload.ingredients,
        ingredients,
        newRecipe.id,
      )

    newRecipe.steps = await this.stepService.createSteps(
      payload.steps,
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
