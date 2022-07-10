import { Column, Entity, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

import { CategoryTopic } from './category.types'

@Entity()
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: CategoryTopic, unique: true })
  name: CategoryTopic
}
