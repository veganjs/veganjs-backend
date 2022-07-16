import {
  Column,
  Entity,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { RecipeIngredientEntity } from './recipe-ingredient.entity'

@Entity()
export class RecipeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @OneToMany(
    () => RecipeIngredientEntity,
    (recipeIngredient) => recipeIngredient.recipe,
    { cascade: true },
  )
  ingredients: RecipeIngredientEntity[]
}
