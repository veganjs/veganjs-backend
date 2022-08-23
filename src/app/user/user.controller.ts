import { Get, Param, Controller } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { ApiGetOne } from '~/shared/decorators'

import { JwtAuthRequired } from '../auth/decorators/jwt-auth.decorator'
import { GetUser } from './decorators/user.decorator'
import { User } from './dto/user.dto'
import { UserEntity } from './entities/user.entity'
import { UserService } from './user.service'

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiGetOne({ model: User, attribute: 'username' })
  getUserByUsername(@Param('username') username: string) {
    return this.userService.getUserByUsername(username)
  }

  @Get('me')
  @JwtAuthRequired()
  @ApiOkResponse({ type: User, description: 'Current user has been fetched' })
  @ApiOperation({ summary: 'Get current user' })
  getMe(@GetUser() user: UserEntity) {
    return user
  }
}
