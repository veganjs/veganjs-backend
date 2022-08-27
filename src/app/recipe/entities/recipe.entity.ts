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

import { Time } from '../dto/recipe.dto'
import { UserEntity } from '../../user/entities/user.entity'
import { CategoryEntity } from '../../category/entities/category.entity'
import { RecipeIngredientEntity } from './recipe-ingredient.entity'

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

  @Column('simple-json', { nullable: true })
  preparationTime: Time

  @Column('simple-json')
  cookingTime: Time

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

  @ManyToOne(() => UserEntity, (user) => user.recipes, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  author: UserEntity
}
