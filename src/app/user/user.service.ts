import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { InjectRepository } from '@nestjs/typeorm'

import { PostgresError } from '~/shared/types'
import { staticPath } from '~/config/constants.config'

import { UserRepository } from './repositories/user.repository'
import { FileService } from '../file/file.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly fileService: FileService,
  ) {}

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async updateUser(payload: UpdateUserDto, userId: string) {
    try {
      const user = await this.getUserById(userId)
      await this.userRepository.update(
        { id: user.id },
        {
          ...(payload.username && { username: payload.username }),
          ...(payload.avatar && { avatar: payload.avatar }),
        },
      )
      return await this.userRepository.findOne({ where: { id: user.id } })
    } catch (error) {
      if (error.code === PostgresError.UniqueViolation) {
        throw new ConflictException(`User ${payload.username} already exists`)
      }
    }
  }

  async uploadAvatar(req: FastifyRequest, userId: string) {
    const {
      id,
      username,
      avatar: oldAvatarPath,
    } = await this.getUserById(userId)

    const filePath = await this.fileService.uploadFile(req, {
      destination: `${staticPath}/avatars`,
      rename: (fileName) => `${username}_${Date.now()}_${fileName}`,
    })

    if (oldAvatarPath) {
      await this.fileService.deleteFile(oldAvatarPath)
    }

    return await this.updateUser({ avatar: filePath }, id)
  }
}
