import { Module } from '@nestjs/common'

import { TypeOrmExModule } from '~/shared/lib/typeorm-ex'

import { FileService } from '../file/file.service'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserRepository } from './repositories/user.repository'

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [UserController],
  providers: [UserService, FileService],
})
export class UserModule {}
