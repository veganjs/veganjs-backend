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

import { Category } from './category.dto'
import { CategoryService } from './category.service'

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @ApiOkResponse()
  @ApiOperation({ summary: 'Get all categories' })
  getAll() {
    return this.categoryService.getCategories()
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: 'Get category by id' })
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.getCategory(id)
  }

  @Post()
  @ApiCreatedResponse()
  @ApiConflictResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: 'Create new category' })
  create(@Body() category: Category) {
    return this.categoryService.createCategory(category)
  }

  @Put(':id')
  @ApiOkResponse()
  @ApiConflictResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: 'Update category by id' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() category: Category) {
    return this.categoryService.updateCategory(id, category)
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: 'Delete category by id' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.deleteCategory(id)
  }
}
