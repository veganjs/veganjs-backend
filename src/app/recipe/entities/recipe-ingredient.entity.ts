import {
  Column,
  Entity,
  ManyToOne,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'

import { ColumnNumericTransformer } from '~/shared/transformers'

import { IngredientEntity } from '../../ingredient/entities/ingredient.entity'
import { MeasureUnit } from '../recipe.types'
import { RecipeEntity } from './recipe.entity'

@Entity()
export class RecipeIngredientEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  @Exclude()
  recipeId: string

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
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
  ingredient: IngredientEntity
}
