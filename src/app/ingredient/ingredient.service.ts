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

import { CreateIngredientDto } from './dto/create-ingredient.dto'
import { UpdateIngredientDto } from './dto/update-ingredient.dto'
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
      return await this.ingredientRepository.save(payload)
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException(`Ingredient ${payload.name} already exists`)
      }
    }
  }

  async updateIngredient(id: string, payload: UpdateIngredientDto) {
    try {
      await this.getIngredientById(id)
      await this.ingredientRepository.update({ id }, payload)
      return await this.getIngredientById(id)
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException(`Ingredient ${payload.name} already exists`)
      }
    }
  }

  async deleteIngredient(id: string) {
    const ingredient = await this.ingredientRepository.delete(id)
    if (ingredient.affected === 0) {
      throw new NotFoundException('Ingredient not found')
    }
  }
}
