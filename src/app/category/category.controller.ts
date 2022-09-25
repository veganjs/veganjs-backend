import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  ApiGetMany,
  ApiGetOne,
  ApiCreate,
  ApiUpdate,
  ApiDelete,
} from '~/shared/lib/crud-decorators'
import { Role } from '~/shared/types'

import { JwtAuthRequired } from '../auth/decorators/jwt-auth.decorator'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoryDto } from './dto/category.dto'
import { CategoryService } from './category.service'

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiGetMany({ model: CategoryDto })
  getAllCategories() {
    return this.categoryService.getAllCategories()
  }

  @Get(':id')
  @ApiGetOne({ model: CategoryDto })
  getCategoryById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.getCategoryById(id)
  }

  @Post()
  @JwtAuthRequired(Role.ADMIN)
  @ApiCreate({ model: CategoryDto, conflict: true })
  createCategory(@Body() payload: CreateCategoryDto) {
    return this.categoryService.createCategory(payload)
  }

  @Put(':id')
  @JwtAuthRequired(Role.ADMIN)
  @ApiUpdate({ model: CategoryDto, conflict: true })
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, payload)
  }

  @Delete(':id')
  @JwtAuthRequired(Role.ADMIN)
  @ApiDelete({ model: CategoryDto })
  deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.deleteCategory(id)
  }
}
