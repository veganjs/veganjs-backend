import {
  Get,
  Post,
  Delete,
  Body,
  Param,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'

import { RecipeService } from './recipe.service'
import { Recipe, RecipePayload } from './dto/recipe.dto'

@Controller('recipes')
@ApiTags('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  @ApiOkResponse({ type: [Recipe], description: 'Recipes list' })
  @ApiOperation({ summary: 'Get all recipes' })
  getAll() {
    return this.recipeService.getAllRecipes()
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
  @ApiCreatedResponse({ type: Recipe, description: 'Created recipe' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiOperation({ summary: 'Create new recipe' })
  create(@Body() recipe: RecipePayload) {
    return this.recipeService.createRecipe(recipe)
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Recipe has been deleted' })
  @ApiNotFoundResponse({ description: 'Recipe not found' })
  @ApiBadRequestResponse({ description: 'Invalid parameter' })
  @ApiOperation({ summary: 'Delete recipe by id' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.recipeService.deleteRecipe(id)
  }
}
