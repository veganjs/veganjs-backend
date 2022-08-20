import {
  Get,
  Post,
  Put,
  Body,
  Delete,
  Param,
  Query,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'

import { ApiPaginatedResponse } from '~/shared/decorators'
import { PaginationOptions } from '~/shared/types'

import { Role } from '../auth/auth.types'
import { Auth } from '../auth/decorators/auth.decorator'
import { Ingredient, IngredientDto } from './dto/ingredient.dto'
import { IngredientService } from './ingredient.service'

@Controller('ingredients')
@ApiTags('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  @ApiPaginatedResponse({ model: Ingredient, description: 'Ingredients list' })
  @ApiOperation({ summary: 'Get all ingredients' })
  @ApiQuery({ name: 'search', description: 'Search query', required: false })
  getAll(@Query('search') search: string, @Query() options: PaginationOptions) {
    return this.ingredientService.getAllIngredients(search, options)
  }

  @Get(':id')
  @ApiOkResponse({ type: Ingredient, description: 'Ingredient' })
  @ApiNotFoundResponse({ description: 'Ingredient not found' })
  @ApiBadRequestResponse({ description: 'Invalid parameter' })
  @ApiOperation({ summary: 'Get ingredient by id' })
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingredientService.getIngredientById(id)
  }

  @Post()
  @Auth(Role.ADMIN)
  @ApiCreatedResponse({ type: Ingredient, description: 'Created ingredient' })
  @ApiConflictResponse({ description: 'Ingredient already exists' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiOperation({ summary: 'Create new ingredient' })
  create(@Body() ingredient: IngredientDto) {
    return this.ingredientService.createIngredient(ingredient)
  }

  @Put(':id')
  @Auth(Role.ADMIN)
  @ApiOkResponse({ type: Ingredient, description: 'Updated ingredient' })
  @ApiConflictResponse({ description: 'Ingredient already exists' })
  @ApiNotFoundResponse({ description: 'Ingredient not found' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiOperation({ summary: 'Update ingredient by id' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() ingredient: IngredientDto,
  ) {
    return this.ingredientService.updateIngredient(id, ingredient)
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiOkResponse({ description: 'Ingredient has been deleted' })
  @ApiNotFoundResponse({ description: 'Ingredient not found' })
  @ApiBadRequestResponse({ description: 'Invalid parameter' })
  @ApiOperation({ summary: 'Delete ingredient by id' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingredientService.deleteIngredient(id)
  }
}
