import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'

import { PostgresError } from '~/shared/types'
import { Path } from '~/config/constants.config'

import { UpdatePasswordDto } from '../auth/dto/update-password.dto'
import { FileService } from '../file/file.service'
import { UserRepository } from './repositories/user.repository'
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

  async updatePassword(payload: UpdatePasswordDto, userId: string) {
    const user = await this.getUserById(userId)
    const isCurrentPasswordConfirmed = await bcrypt.compare(
      payload.oldPassword,
      user.password,
    )

    if (!isCurrentPasswordConfirmed) {
      throw new BadRequestException('Invalid password')
    }

    await this.userRepository.update(
      { id: user.id },
      { password: await bcrypt.hash(payload.newPassword, user.salt) },
    )
  }

  async uploadAvatar(req: FastifyRequest, userId: string) {
    const {
      id,
      username,
      avatar: oldAvatarPath,
    } = await this.getUserById(userId)

    const filePath = await this.fileService.uploadFile(req, {
      destination: `${Path.Static}/avatars`,
      rename: (fileName) => `${username}_${Date.now()}_${fileName}`,
    })

    if (oldAvatarPath) {
      await this.fileService.deleteFile(oldAvatarPath)
    }

    return await this.updateUser({ avatar: filePath }, id)
  }
}
