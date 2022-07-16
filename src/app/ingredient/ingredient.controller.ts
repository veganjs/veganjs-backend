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

import { Ingredient, IngredientPayload } from './dto/ingredient.dto'
import { IngredientService } from './ingredient.service'

@Controller('ingredients')
@ApiTags('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  @ApiOkResponse({ type: [Ingredient], description: 'Ingredients list' })
  @ApiOperation({ summary: 'Get all ingredients' })
  @ApiQuery({ name: 'search', description: 'Search query', required: false })
  getAll(@Query('search') search: string) {
    if (search) {
      return this.ingredientService.searchIngredients(search)
    }
    return this.ingredientService.getAllIngredients()
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
  @ApiCreatedResponse({ type: Ingredient, description: 'Created ingredient' })
  @ApiConflictResponse({ description: 'Ingredient already exists' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiOperation({ summary: 'Create new ingredient' })
  create(@Body() ingredient: IngredientPayload) {
    return this.ingredientService.createIngredient(ingredient)
  }

  @Put(':id')
  @ApiOkResponse({ type: Ingredient, description: 'Updated ingredient' })
  @ApiConflictResponse({ description: 'Ingredient already exists' })
  @ApiNotFoundResponse({ description: 'Ingredient not found' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiOperation({ summary: 'Update ingredient by id' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() ingredient: IngredientPayload,
  ) {
    return this.ingredientService.updateIngredient(id, ingredient)
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Ingredient has been deleted' })
  @ApiNotFoundResponse({ description: 'Ingredient not found' })
  @ApiBadRequestResponse({ description: 'Invalid parameter' })
  @ApiOperation({ summary: 'Delete ingredient by id' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingredientService.deleteIngredient(id)
  }
}
