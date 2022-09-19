import {
  Column,
  Entity,
  BaseEntity,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { DateISO } from '~/shared/types'
import { ColumnDateTransformer } from '~/shared/transformers'

import { UserEntity } from '../../user/entities/user.entity'
import { CategoryEntity } from '../../category/entities/category.entity'
import { RecipeIngredientEntity } from './recipe-ingredient.entity'
import { StepEntity } from './step.entity'

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
  createdAt: DateISO

  @UpdateDateColumn({
    type: 'timestamptz',
    transformer: new ColumnDateTransformer(),
  })
  updatedAt: DateISO

  @ManyToOne(() => CategoryEntity, (category) => category.recipes, {
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
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  author: UserEntity
}
