import { Get, Controller } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'

import { JwtAuthRequired } from '../auth/decorators/jwt-auth.decorator'
import { GetUser } from './decorators/user.decorator'
import { User } from './dto/user.dto'
import { UserEntity } from './entities/user.entity'
import { UserService } from './user.service'

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @JwtAuthRequired()
  @ApiOkResponse({ type: User, description: 'Current user' })
  @ApiOperation({ summary: 'Get current user' })
  getAll(@GetUser() user: UserEntity) {
    return user
  }
}
