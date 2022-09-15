import {
  Entity,
  Column,
  ManyToOne,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'

import { RecipeEntity } from './recipe.entity'

@Entity()
export class StepEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  @Exclude()
  recipeId: string

  @Column()
  order: number

  @Column({ length: 500 })
  description: string

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.steps, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  recipe: RecipeEntity
}
