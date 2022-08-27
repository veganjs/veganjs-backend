import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'

import { UserService } from '../user/user.service'
import { UserEntity } from '../user/entities/user.entity'
import { FileService } from '../file/file.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    FileService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
