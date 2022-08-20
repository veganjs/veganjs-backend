import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PostgresError } from '~/shared/types'

import {
  LoginCredentialsDto,
  SignUpCredentialsDto,
} from '../auth/dto/auth-credentials.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(credentials: SignUpCredentialsDto) {
    const user = new UserEntity()

    user.username = credentials.username
    user.password = credentials.password

    try {
      await user.save()
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException('Username already exists')
      }
    }
  }

  async validateUserPassword(credentials: LoginCredentialsDto) {
    const user = await this.usersRepository.findOne({
      where: { username: credentials.username },
    })

    if (user && (await user.validatePassword(credentials.password))) {
      return user
    }

    return null
  }
}
