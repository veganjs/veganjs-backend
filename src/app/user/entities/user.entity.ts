import {
  Column,
  Entity,
  BaseEntity,
  BeforeInsert,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import * as bcrypt from 'bcryptjs'

import { Role } from '../../auth/auth.types'

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
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

  @BeforeInsert()
  async hashPassword() {
    this.salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, this.salt)
  }

  async validatePassword(password: string) {
    const hash = await bcrypt.hash(password, this.salt)
    return hash === this.password
  }
}
