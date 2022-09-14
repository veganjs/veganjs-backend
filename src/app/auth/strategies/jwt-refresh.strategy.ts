import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { FastifyRequest } from 'fastify'

import { JwtUser } from '~/shared/types'

import { UserRepository } from '../../user/repositories/user.repository'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
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
    const user = await this.userRepository.getUserIfRefreshTokenMatches(
      id,
      refreshToken,
    )
    return user
  }
}
