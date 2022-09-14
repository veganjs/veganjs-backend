import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { TypeOrmExModule } from '~/shared/lib/typeorm-ex'

import { FileService } from '../file/file.service'
import { UserRepository } from '../user/repositories/user.repository'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, FileService, JwtStrategy, JwtRefreshStrategy],
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
