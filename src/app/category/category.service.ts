import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { PostgresError } from '~/shared/types'

import { CategoryDto } from './dto/category.dto'
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
    const result = await this.categoryRepository.findOne({ where: { id } })
    if (!result) {
      throw new NotFoundException()
    }
    return result
  }

  async createCategory(category: CategoryDto) {
    try {
      return await this.categoryRepository.save(category)
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException(`Category ${category.name} already exists`)
      }
    }
  }

  async updateCategory(id: string, category: CategoryDto) {
    try {
      const result = await this.getCategoryById(id)
      await this.categoryRepository.update({ id: result.id }, category)
      return await this.categoryRepository.findOne({ where: { id } })
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException(`Category ${category.name} already exists`)
      }
    }
  }

  async deleteCategory(id: string) {
    const result = await this.categoryRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException('Category not found')
    }
  }
}
