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
} from '~/shared/lib/crud-decorators'
import { PaginationOptions } from '~/shared/lib/pagination'
import { JwtUser } from '~/shared/types'

import { JwtAuthRequired } from '../auth/decorators/jwt-auth.decorator'
import { GetUser } from '../user/decorators/user.decorator'
import { RecipeOwnerRequired } from './decorators/owner.decorator'
import { RecipeService } from './recipe.service'
import { RecipeDto } from './dto/recipe.dto'
import { CreateRecipeDto } from './dto/create-recipe.dto'

// TODO edit recipe
@Controller('recipes')
@ApiTags('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  @ApiGetMany({ model: RecipeDto, paginated: true, search: true })
  getAllRecipes(
    @Query('search') search: string,
    @Query() options: PaginationOptions,
  ) {
    return this.recipeService.getAllRecipes(search, options)
  }

  @Get(':id')
  @ApiGetOne({ model: RecipeDto })
  getRecipeById(@Param('id', ParseUUIDPipe) id: string) {
    return this.recipeService.getRecipeById(id)
  }

  @Post()
  @JwtAuthRequired()
  @ApiCreate({ model: RecipeDto })
  @ApiNotFoundResponse({ description: 'Ingredients not found' })
  createRecipe(@GetUser() user: JwtUser, @Body() payload: CreateRecipeDto) {
    return this.recipeService.createRecipe(payload, user.id)
  }

  @Delete(':id')
  @RecipeOwnerRequired()
  @ApiDelete({ model: RecipeDto })
  deleteRecipe(@Param('id', ParseUUIDPipe) id: string) {
    return this.recipeService.deleteRecipe(id)
  }
}
