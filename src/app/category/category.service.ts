import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    return await this.prisma.category.findMany()
  }

  async getCategoryById(id: string) {
    return await this.prisma.category.findUniqueOrThrow({
      where: { id },
    })
  }

  async createCategory(payload: CreateCategoryDto) {
    return await this.prisma.category.create({ data: payload })
  }

  async updateCategory(id: string, payload: UpdateCategoryDto) {
    return await this.prisma.category.update({ where: { id }, data: payload })
  }

  async deleteCategory(id: string) {
    return await this.prisma.category.delete({ where: { id } })
  }
}
