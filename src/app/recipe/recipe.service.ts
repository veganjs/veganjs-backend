import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import {
  Paginated,
  PaginationMeta,
  PaginationOptions,
} from '~/shared/lib/pagination'
import {
  Filter,
  applySearchFilter,
  applyWhereFilters,
} from '~/shared/lib/filters'

import { IngredientService } from '../ingredient/ingredient.service'
import { CategoryService } from '../category/category.service'
import { UserService } from './../user/user.service'
import { RecipeEntity } from './entities/recipe.entity'
import { CreateRecipeDto } from './dto/create-recipe.dto'
import { RecipeIngredientRepository } from './repositories/recipe-ingredient.repository'
import { StepRepository } from './repositories/step.repository'

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
    @InjectRepository(RecipeIngredientRepository)
    private readonly recipeIngredientRepository: RecipeIngredientRepository,
    @InjectRepository(StepRepository)
    private readonly stepRepository: StepRepository,
    @Inject(IngredientService)
    private readonly ingredientService: IngredientService,
    @Inject(CategoryService)
    private readonly categoryService: CategoryService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async searchRecipes(
    query: string,
    options: PaginationOptions,
    filters: Filter[],
  ) {
    const queryBuilder = this.recipeRepository.createQueryBuilder('recipe')

    queryBuilder
      .leftJoinAndSelect('recipe.category', 'category')
      .leftJoinAndSelect('recipe.author', 'author')
      .leftJoinAndSelect('recipe.steps', 'steps')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('ingredients.ingredient', 'ingredient')
      .orderBy('recipe.title', options.sort)
      .skip(options.skip)
      .take(options.limit)

    applySearchFilter(queryBuilder, {
      query,
      searchFields: ['title', 'description'],
    })

    applyWhereFilters(queryBuilder, { filters })

    const totalCount = await queryBuilder.getCount()
    const { entities } = await queryBuilder.getRawAndEntities()

    const meta = new PaginationMeta({ totalCount, options })
    return new Paginated(entities, meta)
  }

  async getRecipeById(id: string) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: [
        'steps',
        'author',
        'category',
        'ingredients',
        'ingredients.ingredient',
      ],
    })

    if (!recipe) {
      throw new NotFoundException('Recipe not found')
    }

    return recipe
  }

  async createRecipe(payload: CreateRecipeDto, userId: string) {
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
      await this.recipeIngredientRepository.createRecipeIngredients(
        payload.ingredients,
        ingredients,
        newRecipe.id,
      )

    newRecipe.steps = await this.stepRepository.createSteps(
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
