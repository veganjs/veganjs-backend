import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserService } from './user.service'
import { UserEntity } from './entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
})
export class UserModule {}
