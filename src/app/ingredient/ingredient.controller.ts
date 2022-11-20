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
} from '~/shared/lib/crud-decorators'
import { PaginationOptions } from '~/shared/lib/pagination'
import { Role } from '~/shared/types'

import { JwtAuthRequired } from '../auth/decorators/jwt-auth.decorator'
import { IngredientDto } from './dto/ingredient.dto'
import { CreateIngredientDto } from './dto/create-ingredient.dto'
import { UpdateIngredientDto } from './dto/update-ingredient.dto'
import { IngredientService } from './ingredient.service'

@Controller('ingredients')
@ApiTags('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  @ApiGetMany({ model: IngredientDto, paginated: true, search: true })
  getAllIngredients(
    @Query('search') search: string,
    @Query() options: PaginationOptions,
  ) {
    if (search) {
      return this.ingredientService.searchIngredients(search, options)
    }
    return this.ingredientService.getAllIngredients(options)
  }

  @Get(':id')
  @ApiGetOne({ model: IngredientDto })
  getIngredientById(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingredientService.getIngredientById(id)
  }

  @Post()
  @JwtAuthRequired(Role.ADMIN)
  @ApiCreate({ model: IngredientDto, conflict: true })
  createIngredient(@Body() payload: CreateIngredientDto) {
    return this.ingredientService.createIngredient(payload)
  }

  @Put(':id')
  @JwtAuthRequired(Role.ADMIN)
  @ApiUpdate({ model: IngredientDto, conflict: true })
  updateIngredient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateIngredientDto,
  ) {
    return this.ingredientService.updateIngredient(id, payload)
  }

  @Delete(':id')
  @JwtAuthRequired(Role.ADMIN)
  @ApiDelete({ model: IngredientDto })
  deleteIngredient(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingredientService.deleteIngredient(id)
  }
}
