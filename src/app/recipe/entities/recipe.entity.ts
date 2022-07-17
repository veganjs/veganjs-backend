import {
  Column,
  Entity,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm'

import { CategoryEntity } from '../../category/entities/category.entity'
import { RecipeIngredientEntity } from './recipe-ingredient.entity'

@Entity()
export class RecipeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @ManyToOne(() => CategoryEntity, (category) => category.recipes, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: CategoryEntity

  @OneToMany(
    () => RecipeIngredientEntity,
    (recipeIngredient) => recipeIngredient.recipe,
    { cascade: true },
  )
  ingredients: RecipeIngredientEntity[]
}
