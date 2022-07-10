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
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiQuery,
} from '@nestjs/swagger'

import { Ingredient } from './ingredient.dto'
import { IngredientService } from './ingredient.service'

@Controller('ingredients')
@ApiTags('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get all ingredients' })
  @ApiQuery({ name: 'search', required: false })
  getAll(@Query('search') search: string) {
    if (search) {
      return this.ingredientService.searchIngredients(search)
    }
    return this.ingredientService.getIngredients()
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: 'Get ingredient by id' })
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingredientService.getIngredient(id)
  }

  @Post()
  @ApiCreatedResponse()
  @ApiConflictResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: 'Create new ingredient' })
  create(@Body() ingredient: Ingredient) {
    return this.ingredientService.createIngredient(ingredient)
  }

  @Put(':id')
  @ApiOkResponse()
  @ApiConflictResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: 'Update ingredient by id' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() ingredient: Ingredient,
  ) {
    return this.ingredientService.updateIngredient(id, ingredient)
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: 'Delete ingredient by id' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingredientService.deleteIngredient(id)
  }
}
