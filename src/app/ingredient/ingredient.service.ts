import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import {
  Paginated,
  PaginationMeta,
  PaginationOptions,
  PostgresError,
} from '~/shared/types'

import { IngredientDto } from './dto/ingredient.dto'
import { IngredientEntity } from './entities/ingredient.entity'

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepository: Repository<IngredientEntity>,
  ) {}

  async getAllIngredients(query: string, options: PaginationOptions) {
    const queryBuilder =
      this.ingredientRepository.createQueryBuilder('ingredient')

    queryBuilder
      .skip(options.skip)
      .take(options.limit)
      .orderBy('ingredient.name', options.sort)

    if (query) {
      queryBuilder.where('LOWER(ingredient.name) LIKE LOWER(:query)', {
        query: `%${query}%`,
      })
    }

    const totalCount = await queryBuilder.getCount()
    const { entities } = await queryBuilder.getRawAndEntities()

    const meta = new PaginationMeta({ totalCount, options })
    return new Paginated(entities, meta)
  }

  async getIngredientsByIds(ids: string[]) {
    return await this.ingredientRepository.find({
      where: { id: In(ids) },
    })
  }

  async getIngredientById(id: string) {
    const result = await this.ingredientRepository.findOne({ where: { id } })
    if (!result) {
      throw new NotFoundException()
    }
    return result
  }

  async createIngredient(ingredient: IngredientDto) {
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

  async updateIngredient(id: string, ingredient: IngredientDto) {
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
      throw new NotFoundException('Ingredient not found')
    }
  }
}
