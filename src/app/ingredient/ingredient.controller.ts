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
import { ApiTags } from '@nestjs/swagger'

import {
  ApiCreate,
  ApiDelete,
  ApiGetMany,
  ApiGetOne,
  ApiUpdate,
} from '~/shared/decorators'
import { PaginationOptions, Role } from '~/shared/types'

import { JwtAuthRequired } from '../auth/decorators/jwt-auth.decorator'
import { Ingredient, IngredientDto } from './dto/ingredient.dto'
import { IngredientService } from './ingredient.service'

@Controller('ingredients')
@ApiTags('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  @ApiGetMany({ model: Ingredient, paginated: true, search: true })
  getAllIngredients(
    @Query('search') search: string,
    @Query() options: PaginationOptions,
  ) {
    return this.ingredientService.getAllIngredients(search, options)
  }

  @Get(':id')
  @ApiGetOne({ model: Ingredient })
  getIngredientById(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingredientService.getIngredientById(id)
  }

  @Post()
  @JwtAuthRequired(Role.ADMIN)
  @ApiCreate({ model: Ingredient, conflict: true })
  createIngredient(@Body() payload: IngredientDto) {
    return this.ingredientService.createIngredient(payload)
  }

  @Put(':id')
  @JwtAuthRequired(Role.ADMIN)
  @ApiUpdate({ model: Ingredient, conflict: true })
  updateIngredient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: IngredientDto,
  ) {
    return this.ingredientService.updateIngredient(id, payload)
  }

  @Delete(':id')
  @JwtAuthRequired(Role.ADMIN)
  @ApiDelete({ model: Ingredient })
  deleteIngredient(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingredientService.deleteIngredient(id)
  }
}
