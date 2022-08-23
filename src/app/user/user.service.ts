import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'

import { PostgresError } from '~/shared/types'

import { LoginCredentialsDto, SignUpCredentialsDto } from '../auth/dto/auth.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException()
    }
    return user
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } })
    if (!user) {
      throw new NotFoundException()
    }
    return user
  }

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
    const user = await this.userRepository.findOne({
      where: { username: credentials.username },
    })

    if (user && (await user.validatePassword(credentials.password))) {
      return user
    }
    return null
  }

  async setCurrentRefreshToken(user: UserEntity, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, user.salt)
    await this.userRepository.update(
      { id: user.id },
      { refreshToken: hashedRefreshToken },
    )
  }

  async resetRefreshToken(id: string) {
    const user = await this.getUserById(id)
    return this.userRepository.update(
      { id: user.id },
      {
        refreshToken: null,
      },
    )
  }

  async getUserIfRefreshTokenMatches(id: string, refreshToken: string) {
    const user = await this.getUserById(id)

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
