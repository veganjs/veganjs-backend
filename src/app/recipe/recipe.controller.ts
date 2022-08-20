import {
  Get,
  Post,
  Delete,
  Query,
  Body,
  Param,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'

import { ApiPaginatedResponse } from '~/shared/decorators'
import { PaginationOptions } from '~/shared/types'

import { Auth } from '../auth/decorators/auth.decorator'
import { RecipeService } from './recipe.service'
import { Recipe, RecipeDto } from './dto/recipe.dto'

// TODO edit recipe
@Controller('recipes')
@ApiTags('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  @ApiPaginatedResponse({ model: Recipe, description: 'Recipes list' })
  @ApiOperation({ summary: 'Get all recipes' })
  @ApiQuery({ name: 'search', description: 'Search query', required: false })
  getAll(@Query('search') search: string, @Query() options: PaginationOptions) {
    return this.recipeService.getAllRecipes(search, options)
  }

  @Get(':id')
  @ApiOkResponse({ type: Recipe, description: 'Recipe' })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiBadRequestResponse({ description: 'Invalid parameter' })
  @ApiOperation({ summary: 'Get recipe by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.recipeService.getRecipeById(id)
  }

  @Post()
  @Auth()
  @ApiCreatedResponse({ type: Recipe, description: 'Created recipe' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiNotFoundResponse({ description: 'Ingredients not found' })
  @ApiOperation({ summary: 'Create new recipe' })
  create(@Body() recipe: RecipeDto) {
    return this.recipeService.createRecipe(recipe)
  }

  @Delete(':id')
  @Auth()
  @ApiOkResponse({ description: 'Recipe has been deleted' })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiBadRequestResponse({ description: 'Invalid parameter' })
  @ApiOperation({ summary: 'Delete recipe by id' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.recipeService.deleteRecipe(id)
  }
}
