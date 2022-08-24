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

import { JwtAuthRequired } from '../auth/decorators/jwt-auth.decorator'
import { GetUser } from '../user/decorators/user.decorator'
import { UserEntity } from '../user/entities/user.entity'
import { RecipeOwnerRequired } from './decorators/owner.decorator'
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
  @JwtAuthRequired()
  @ApiCreate({ model: Recipe })
  @ApiNotFoundResponse({ description: 'Ingredients not found' })
  createRecipe(@GetUser() user: UserEntity, @Body() recipe: RecipeDto) {
    return this.recipeService.createRecipe(recipe, user.id)
  }

  @Delete(':id')
  @RecipeOwnerRequired()
  @ApiDelete({ model: Recipe })
  deleteRecipe(@Param('id', ParseUUIDPipe) id: string) {
    return this.recipeService.deleteRecipe(id)
  }
}
