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

import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoryService } from './category.service'
import { CategoryEntity } from './entities/category.entity'

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiGetMany({ model: CategoryEntity })
  getAllCategories() {
    return this.categoryService.getAllCategories()
  }

  @Get(':id')
  @ApiGetOne({ model: CategoryEntity })
  getCategoryById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.getCategoryById(id)
  }

  @Post()
  @ApiCreate({ model: CategoryEntity, conflict: true })
  createCategory(@Body() payload: CreateCategoryDto) {
    return this.categoryService.createCategory(payload)
  }

  @Put(':id')
  @ApiUpdate({ model: CategoryEntity, conflict: true })
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, payload)
  }

  @Delete(':id')
  @ApiDelete({ model: CategoryEntity })
  deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.deleteCategory(id)
  }
}
