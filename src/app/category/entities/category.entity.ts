import {
  Column,
  Entity,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { RecipeEntity } from '../../recipe/entities/recipe.entity'
import { CategoryTopic } from '../category.types'

@Entity()
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: CategoryTopic, unique: true })
  name: CategoryTopic

  @OneToMany(() => RecipeEntity, (recipe) => recipe.category)
  recipes: RecipeEntity[]
}
