import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'

import { PostgresError } from '~/shared/types'

import { IngredientPayload } from './dto/ingredient.dto'
import { IngredientEntity } from './entities/ingredient.entity'

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(IngredientEntity)
    private ingredientRepository: Repository<IngredientEntity>,
  ) {}

  async getAllIngredients() {
    return await this.ingredientRepository.find()
  }

  async searchIngredients(query: string) {
    return await this.ingredientRepository.find({
      where: {
        name: ILike(`%${query}%`),
      },
    })
  }

  async getIngredientById(id: string) {
    const result = await this.ingredientRepository.findOne({ where: { id } })
    if (!result) {
      throw new NotFoundException()
    }
    return result
  }

  async createIngredient(ingredient: IngredientPayload) {
    try {
      return await this.ingredientRepository.save(ingredient)
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException(
          `Ingredient ${ingredient.name} already exists`,
        )
      }
    }
  }

  async updateIngredient(id: string, ingredient: IngredientPayload) {
    try {
      const result = await this.getIngredientById(id)
      await this.ingredientRepository.update({ id: result.id }, ingredient)
      return await this.ingredientRepository.findOne({ where: { id } })
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException(
          `Ingredient ${ingredient.name} already exists`,
        )
      }
    }
  }

  async deleteIngredient(id: string) {
    const result = await this.ingredientRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException()
    }
  }
}
