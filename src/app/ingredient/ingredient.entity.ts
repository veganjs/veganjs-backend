import { Column, Entity, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class IngredientEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  name: string
}
