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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger'

import { Role } from '../auth/auth.types'
import { Auth } from '../auth/decorators/auth.decorator'
import { Category, CategoryDto } from './dto/category.dto'
import { CategoryService } from './category.service'

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @ApiOkResponse({ type: [Category], description: 'Categories list' })
  @ApiOperation({ summary: 'Get all categories' })
  getAll() {
    return this.categoryService.getAllCategories()
  }

  @Get(':id')
  @ApiOkResponse({ type: Category, description: 'Category' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiBadRequestResponse({ description: 'Invalid parameter' })
  @ApiOperation({ summary: 'Get category by id' })
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.getCategoryById(id)
  }

  @Post()
  @Auth(Role.ADMIN)
  @ApiCreatedResponse({ type: Category, description: 'Created category' })
  @ApiConflictResponse({ description: 'Category already exists' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiOperation({ summary: 'Create new category' })
  create(@Body() category: CategoryDto) {
    return this.categoryService.createCategory(category)
  }

  @Put(':id')
  @Auth(Role.ADMIN)
  @ApiOkResponse({ type: Category, description: 'Updated category' })
  @ApiConflictResponse({ description: 'Category already exists' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiOperation({ summary: 'Update category by id' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() category: CategoryDto,
  ) {
    return this.categoryService.updateCategory(id, category)
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  @ApiOkResponse({ description: 'Category has been deleted' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiBadRequestResponse({ description: 'Invalid parameter' })
  @ApiOperation({ summary: 'Delete category by id' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.deleteCategory(id)
  }
}
