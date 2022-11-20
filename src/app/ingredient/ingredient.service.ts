import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { PostgresError } from '~/database'
import { paginate, PaginationOptions } from '~/shared/lib/pagination'

import { CreateIngredientDto } from './dto/create-ingredient.dto'
import { UpdateIngredientDto } from './dto/update-ingredient.dto'
import { IngredientEntity } from './entities/ingredient.entity'
import IngredientSearchService from './ingredient-search.service'

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepository: Repository<IngredientEntity>,
    private readonly ingredientSearchService: IngredientSearchService,
  ) {}

  async getAllIngredients(options: PaginationOptions) {
    const queryBuilder =
      this.ingredientRepository.createQueryBuilder('ingredient')

    queryBuilder
      .orderBy('ingredient.name', options.sort)
      .skip(options.skip)
      .take(options.limit)

    return paginate(options, queryBuilder)
  }

  async searchIngredients(query: string, options: PaginationOptions) {
    const queryBuilder =
      this.ingredientRepository.createQueryBuilder('ingredient')
    const results = await this.ingredientSearchService.searchIngredients(query)
    const ids = results.map(({ id }) => id)

    if (!ids.length) {
      return paginate(options)
    }

    queryBuilder
      .where('id IN (:...ids)', { ids })
      .orderBy('ingredient.name', options.sort)
      .skip(options.skip)
      .take(options.limit)

    return paginate(options, queryBuilder)
  }

  async getIngredientsByIds(ids: string[]) {
    return await this.ingredientRepository.find({
      where: { id: In(ids) },
    })
  }

  async getIngredientById(id: string) {
    const ingredient = await this.ingredientRepository.findOne({
      where: { id },
    })
    if (!ingredient) {
      throw new NotFoundException('Ingredient not found')
    }
    return ingredient
  }

  async createIngredient(payload: CreateIngredientDto) {
    try {
      const ingredient = await this.ingredientRepository.save(payload)
      await this.ingredientSearchService.indexIngredient(ingredient)
      return ingredient
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException(`Ingredient ${payload.name} already exists`)
      }
    }
  }

  async updateIngredient(id: string, payload: UpdateIngredientDto) {
    try {
      const ingredient = await this.getIngredientById(id)
      await this.ingredientRepository.update({ id }, payload)
      await this.ingredientSearchService.updateIndex(ingredient)
      return await this.getIngredientById(id)
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException(`Ingredient ${payload.name} already exists`)
      }
    }
  }

  async deleteIngredient(id: string) {
    const ingredient = await this.ingredientRepository.delete(id)
    if (!ingredient.affected) {
      throw new NotFoundException('Ingredient not found')
    }
    await this.ingredientSearchService.removeIndex(id)
  }
}
