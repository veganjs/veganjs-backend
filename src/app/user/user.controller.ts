import {
  Req,
  Get,
  Post,
  Patch,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Controller,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'

import { ApiFormData, ApiGetOne } from '~/shared/decorators'
import { JwtUser } from '~/shared/types'

import { JwtAuthRequired } from '../auth/decorators/jwt-auth.decorator'
import { UpdatePasswordDto } from '../auth/dto/update-password.dto'
import { GetUser } from './decorators/user.decorator'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UserDto } from './dto/user.dto'
import { UserService } from './user.service'

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  @ApiGetOne({ model: UserDto, attribute: 'username' })
  getUserByUsername(@Param('username') username: string) {
    return this.userService.getUserByUsername(username)
  }

  @Get('me')
  @JwtAuthRequired()
  @ApiOkResponse({
    type: UserDto,
    description: 'Current user has been fetched',
  })
  @ApiOperation({ summary: 'Get current user' })
  getMe(@GetUser() user: JwtUser) {
    return user
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @JwtAuthRequired()
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiOkResponse({ description: 'User profile has been updated' })
  @ApiOperation({ summary: 'Update user profile' })
  updateProfile(@GetUser() user: JwtUser, @Body() payload: UpdateProfileDto) {
    return this.userService.updateUser(payload, user.id)
  }

  @Put('change-password')
  @JwtAuthRequired()
  @ApiBadRequestResponse({ description: 'Invalid body or password' })
  @ApiOkResponse({ description: 'User password has been updated' })
  @ApiOperation({ summary: 'Update user password' })
  updatePassword(@GetUser() user: JwtUser, @Body() payload: UpdatePasswordDto) {
    return this.userService.updatePassword(payload, user.id)
  }

  @Post('avatar')
  @HttpCode(HttpStatus.OK)
  @JwtAuthRequired()
  @ApiFormData()
  @ApiOkResponse({ description: 'User avatar has been uploaded' })
  @ApiOperation({ summary: 'Upload user avatar' })
  uploadAvatar(@GetUser() user: JwtUser, @Req() req: FastifyRequest) {
    return this.userService.uploadAvatar(req, user.id)
  }
}
