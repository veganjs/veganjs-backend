import {
  Column,
  Entity,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'

import { IngredientEntity } from '../../ingredient/entities/ingredient.entity'
import { RecipeEntity } from './recipe.entity'
import { MeasureUnit } from '../recipe.types'

@Entity()
export class RecipeIngredientEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  @Exclude()
  recipeId: string

  @Column({ type: 'decimal' })
  amount: number

  @Column({ type: 'enum', enum: MeasureUnit, nullable: true })
  unit: MeasureUnit

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.ingredients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  recipe: RecipeEntity

  @ManyToOne(() => IngredientEntity, (ingredient) => ingredient.recipes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ingredientId', referencedColumnName: 'id' }])
  ingredient: IngredientEntity
}
