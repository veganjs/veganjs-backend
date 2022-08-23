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
import { ApiTags, ApiNotFoundResponse } from '@nestjs/swagger'

import {
  ApiCreate,
  ApiDelete,
  ApiGetMany,
  ApiGetOne,
} from '~/shared/decorators'
import { PaginationOptions } from '~/shared/types'

import { Role } from '../auth/auth.types'
import { JwtAuthRequired } from '../auth/decorators/jwt-auth.decorator'
import { RecipeService } from './recipe.service'
import { Recipe, RecipeDto } from './dto/recipe.dto'

// TODO edit recipe
@Controller('recipes')
@ApiTags('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  @ApiGetMany({ model: Recipe, paginated: true, search: true })
  getAllRecipes(
    @Query('search') search: string,
    @Query() options: PaginationOptions,
  ) {
    return this.recipeService.getAllRecipes(search, options)
  }

  @Get(':id')
  @ApiGetOne({ model: Recipe })
  getRecipeById(@Param('id', ParseUUIDPipe) id: string) {
    return this.recipeService.getRecipeById(id)
  }

  @Post()
  @JwtAuthRequired(Role.ADMIN)
  @ApiCreate({ model: Recipe })
  @ApiNotFoundResponse({ description: 'Ingredients not found' })
  createRecipe(@Body() recipe: RecipeDto) {
    return this.recipeService.createRecipe(recipe)
  }

  @Delete(':id')
  @JwtAuthRequired(Role.ADMIN)
  @ApiDelete({ model: Recipe })
  deleteRecipe(@Param('id', ParseUUIDPipe) id: string) {
    return this.recipeService.deleteRecipe(id)
  }
}
