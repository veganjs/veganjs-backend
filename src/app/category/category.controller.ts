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
} from '~/shared/decorators'
import { Role } from '~/shared/types'

import { JwtAuthRequired } from '../auth/decorators/jwt-auth.decorator'
import { Category, CategoryDto } from './dto/category.dto'
import { CategoryService } from './category.service'

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiGetMany({ model: Category })
  getAllCategories() {
    return this.categoryService.getAllCategories()
  }

  @Get(':id')
  @ApiGetOne({ model: Category })
  getCategoryById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.getCategoryById(id)
  }

  @Post()
  @JwtAuthRequired(Role.ADMIN)
  @ApiCreate({ model: Category, conflict: true })
  createCategory(@Body() payload: CategoryDto) {
    return this.categoryService.createCategory(payload)
  }

  @Put(':id')
  @JwtAuthRequired(Role.ADMIN)
  @ApiUpdate({ model: Category, conflict: true })
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: CategoryDto,
  ) {
    return this.categoryService.updateCategory(id, payload)
  }

  @Delete(':id')
  @JwtAuthRequired(Role.ADMIN)
  @ApiDelete({ model: Category })
  deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.deleteCategory(id)
  }
}
