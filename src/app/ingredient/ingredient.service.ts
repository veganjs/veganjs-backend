import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, In, Repository } from 'typeorm'

import {
  Paginated,
  PaginationMeta,
  PaginationOptions,
  PostgresError,
} from '~/shared/types'

import { IngredientPayload } from './dto/ingredient.dto'
import { IngredientEntity } from './entities/ingredient.entity'

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(IngredientEntity)
    private ingredientRepository: Repository<IngredientEntity>,
  ) {}

  async getAllIngredients(options: PaginationOptions) {
    const queryBuilder =
      this.ingredientRepository.createQueryBuilder('ingredient')

    queryBuilder
      .orderBy('ingredient.name', options.sort)
      .skip(options.skip)
      .take(options.limit)

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
