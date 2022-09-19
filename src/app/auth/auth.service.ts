import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { FastifyReply } from 'fastify'

import { JwtUser } from '~/shared/types'

import { UserEntity } from '../user/entities/user.entity'
import { UserRepository } from '../user/repositories/user.repository'
import { LoginCredentialsDto } from './dto/login.dto'
import { SignUpCredentialsDto } from './dto/sign-up.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtAccessTokenCookie(payload: JwtUser) {
    const accessTokenExpiration = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRATION',
    )
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: accessTokenExpiration,
    })
    return `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${accessTokenExpiration}`
  }

  private getJwtRefreshTokenCookie(payload: JwtUser) {
    const refreshTokenExpiration = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    )
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: refreshTokenExpiration,
    })
    const cookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${refreshTokenExpiration}`

    return {
      cookie,
      refreshToken,
    }
  }

  private getCookieForLogout() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ]
  }

  private getJwtPayload(payload: UserEntity | JwtUser) {
    return {
      id: payload.id,
      roles: payload.roles,
      avatar: payload.avatar,
      username: payload.username,
      createdAt: payload.createdAt,
    } as JwtUser
  }

  async signIn(reply: FastifyReply, credentials: LoginCredentialsDto) {
    const user = await this.userRepository.validateUserPassword(credentials)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = this.getJwtPayload(user)
    const accessTokenCookie = this.getJwtAccessTokenCookie(payload)
    const { cookie: refreshTokenCookie, refreshToken } =
      this.getJwtRefreshTokenCookie(payload)

    await this.userRepository.setCurrentRefreshToken(user, refreshToken)

    reply
      .header('Set-Cookie', [accessTokenCookie, refreshTokenCookie])
      .code(HttpStatus.OK)
  }

  async signUp(credentials: SignUpCredentialsDto) {
    return await this.userRepository.createUser(credentials)
  }

  async refreshToken(reply: FastifyReply, user: JwtUser) {
    const payload = this.getJwtPayload(user)
    const accessTokenCookie = this.getJwtAccessTokenCookie(payload)
    reply.header('Set-Cookie', accessTokenCookie)
  }

  async logout(reply: FastifyReply, user: JwtUser) {
    const logoutCookie = this.getCookieForLogout()
    await this.userRepository.resetRefreshToken(user.id)
    reply.header('Set-Cookie', logoutCookie)
  }
}
