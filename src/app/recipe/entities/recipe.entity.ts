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
import { RecipeIngredientEntity } from './recipe-ingredient.entity'

@Entity()
export class RecipeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @CreateDateColumn({
    type: 'timestamptz',
    transformer: new ColumnDateTransformer(),
  })
  public createdAt?: DateISO

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
