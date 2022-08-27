import {
  Column,
  Entity,
  BaseEntity,
  OneToMany,
  BeforeInsert,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  AfterLoad,
} from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { Exclude } from 'class-transformer'
import * as bcrypt from 'bcryptjs'

import { DateISO, Role } from '~/shared/types'
import { ColumnDateTransformer } from '~/shared/transformers'

import { RecipeEntity } from '../../recipe/entities/recipe.entity'

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string

  @Column({ unique: true })
  username: string

  @Column()
  @Exclude()
  password: string

  @Column()
  @Exclude()
  salt: string

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string

  @Column({
    type: 'enum',
    array: true,
    enum: Role,
    nullable: true,
    default: null,
  })
  @Exclude()
  roles: Role[]

  @Column({ nullable: true })
  avatar: string

  @CreateDateColumn({
    type: 'timestamptz',
    transformer: new ColumnDateTransformer(),
  })
  createdAt?: DateISO

  @OneToMany(() => RecipeEntity, (recipe) => recipe.author)
  recipes: RecipeEntity[]

  @BeforeInsert()
  async hashPassword() {
    this.salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, this.salt)
  }

  @AfterLoad()
  setAvatarUrl() {
    const configService = new ConfigService()
    const filePath = this.avatar

    this.avatar = `${configService.get<string>(
      'HOST_NAME',
    )}:${configService.get<string>('PORT')}/${filePath}`
  }

  async validatePassword(password: string) {
    const hash = await bcrypt.hash(password, this.salt)
    return hash === this.password
  }
}
