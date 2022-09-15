import { ConflictException } from '@nestjs/common'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'

import { PostgresError } from '~/shared/types'
import { CustomRepository } from '~/shared/lib/typeorm-ex'

import { LoginCredentialsDto } from '../../auth/dto/login.dto'
import { SignUpCredentialsDto } from '../../auth/dto/sign-up.dto'
import { UserEntity } from '../entities/user.entity'

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async createUser(credentials: SignUpCredentialsDto) {
    const user = new UserEntity()

    user.username = credentials.username
    user.password = credentials.password
    user.refreshToken = null

    try {
      return await user.save()
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException('Username already exists')
      }
    }
  }

  async validateUserPassword(credentials: LoginCredentialsDto) {
    const user = await this.findOne({
      where: { username: credentials.username },
    })

    if (user && (await user.validatePassword(credentials.password))) {
      return user
    }
    return null
  }

  async setCurrentRefreshToken(user: UserEntity, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, user.salt)
    await this.update({ id: user.id }, { refreshToken: hashedRefreshToken })
  }

  async resetRefreshToken(id: string) {
    return this.update({ id }, { refreshToken: null })
  }

  async getUserIfRefreshTokenMatches(id: string, refreshToken: string) {
    const user = await this.findOne({ where: { id } })

    if (user && user.refreshToken) {
      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      )
      return refreshTokenMatches ? user : null
    }
    return null
  }
}
