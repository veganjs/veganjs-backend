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
    const category = await this.categoryRepository.findOne({ where: { id } })
    if (!category) {
      throw new NotFoundException()
    }
    return category
  }

  async createCategory(payload: CategoryDto) {
    try {
      return await this.categoryRepository.save(payload)
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException(`Category ${payload.name} already exists`)
      }
    }
  }

  async updateCategory(id: string, payload: CategoryDto) {
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
