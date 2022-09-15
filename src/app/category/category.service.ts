import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { PostgresError } from '~/shared/types'

import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoryEntity } from './entities/category.entity'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getAllCategories() {
    return await this.categoryRepository.find()
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } })
    if (!category) {
      throw new NotFoundException('Category not found')
    }
    return category
  }

  async createCategory(payload: CreateCategoryDto) {
    try {
      return await this.categoryRepository.save(payload)
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException(`Category ${payload.name} already exists`)
      }
    }
  }

  async updateCategory(id: string, payload: UpdateCategoryDto) {
    try {
      const category = await this.getCategoryById(id)
      await this.categoryRepository.update({ id: category.id }, payload)
      return await this.categoryRepository.findOne({ where: { id } })
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException(`Category ${payload.name} already exists`)
      }
    }
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.delete(id)
    if (category.affected === 0) {
      throw new NotFoundException('Category not found')
    }
  }
}
