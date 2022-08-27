import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { FastifyReply } from 'fastify'

import { JwtUser } from '~/shared/types'

import { UserEntity } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import { LoginCredentialsDto, SignUpCredentialsDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
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
    const user = await this.userService.validateUserPassword(credentials)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = this.getJwtPayload(user)
    const accessTokenCookie = this.getJwtAccessTokenCookie(payload)
    const { cookie: refreshTokenCookie, refreshToken } =
      this.getJwtRefreshTokenCookie(payload)

    await this.userService.setCurrentRefreshToken(user, refreshToken)

    reply
      .header('Set-Cookie', [accessTokenCookie, refreshTokenCookie])
      .code(HttpStatus.OK)
  }

  async signUp(credentials: SignUpCredentialsDto) {
    return this.userService.createUser(credentials)
  }

  async refreshToken(reply: FastifyReply, user: JwtUser) {
    const payload = this.getJwtPayload(user)
    const accessTokenCookie = this.getJwtAccessTokenCookie(payload)
    reply.header('Set-Cookie', accessTokenCookie)
  }

  async logout(reply: FastifyReply, user: JwtUser) {
    const logoutCookie = this.getCookieForLogout()
    await this.userService.resetRefreshToken(user.id)
    reply.header('Set-Cookie', logoutCookie)
  }
}
