import {
  Column,
  Entity,
  OneToMany,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { RecipeIngredientEntity } from '../../recipe/modules/recipe-ingredient/entities/recipe-ingredient.entity'

@Entity()
export class IngredientEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 40, unique: true })
  name: string

  @OneToMany(
    () => RecipeIngredientEntity,
    (recipeIngredient) => recipeIngredient.ingredient,
    { onDelete: 'CASCADE' },
  )
  recipes: RecipeIngredientEntity[]
}
