import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Repository } from 'typeorm'

import { JwtUser } from '~/shared/types'

import { UserEntity } from './../../user/entities/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    readonly configService: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.Authentication,
      ]),
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    })
  }

  async validate({ id }: JwtUser) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new UnauthorizedException()
    return user
  }
}
