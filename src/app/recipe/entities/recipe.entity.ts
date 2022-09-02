import {
  Column,
  Entity,
  BaseEntity,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { DateISO } from '~/shared/types'
import { ColumnDateTransformer } from '~/shared/transformers'

import { UserEntity } from '../../user/entities/user.entity'
import { CategoryEntity } from '../../category/entities/category.entity'
import { StepEntity } from '../modules/step/entities/step.entity'
import { RecipeIngredientEntity } from '../modules/recipe-ingredient/entities/recipe-ingredient.entity'

@Entity()
export class RecipeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 100 })
  title: string

  @Column({ length: 500 })
  description: string

  @Column({ nullable: true })
  source: string

  @Column()
  servings: number

  @CreateDateColumn({
    type: 'timestamptz',
    transformer: new ColumnDateTransformer(),
  })
  createdAt?: DateISO

  @ManyToOne(() => CategoryEntity, (category) => category.recipes, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  category: CategoryEntity

  @OneToMany(
    () => RecipeIngredientEntity,
    (recipeIngredient) => recipeIngredient.recipe,
    { cascade: true },
  )
  ingredients: RecipeIngredientEntity[]

  @OneToMany(() => StepEntity, (step) => step.recipe, { cascade: true })
  steps: StepEntity[]

  @ManyToOne(() => UserEntity, (user) => user.recipes, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  author: UserEntity
}
