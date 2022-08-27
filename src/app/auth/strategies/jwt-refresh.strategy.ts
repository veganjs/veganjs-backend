import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { FastifyRequest } from 'fastify'

import { JwtUser } from '~/shared/types'

import { UserService } from '../../user/user.service'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly userService: UserService,
    readonly configService: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.Refresh,
      ]),
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
    })
  }

  async validate(request: FastifyRequest, { id }: JwtUser) {
    const refreshToken = request.cookies?.Refresh
    const user = await this.userService.getUserIfRefreshTokenMatches(
      id,
      refreshToken,
    )
    return user
  }
}
