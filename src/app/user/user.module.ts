import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FileService } from '../file/file.service'
import { UserService } from './user.service'
import { UserEntity } from './entities/user.entity'
import { UserController } from './user.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, FileService],
})
export class UserModule {}
