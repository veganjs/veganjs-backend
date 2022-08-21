import { Get, Post, Body, Controller, Res } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger'
import { FastifyReply } from 'fastify'

import { User } from '../user/dto/user.dto'
import { GetUser } from '../user/decorators/user.decorator'
import { UserEntity } from '../user/entities/user.entity'
import { AuthService } from './auth.service'
import { JwtAuthRequired } from './decorators/jwt-auth.decorator'
import { JwtAuthRefreshRequired } from './decorators/jwt-auth-refresh.decorator'
import { LoginCredentialsDto, SignUpCredentialsDto } from './dto/auth.dto'

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiOkResponse({ description: 'Successfully logged in' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  login(@Body() credentials: LoginCredentialsDto, @Res() reply: FastifyReply) {
    return this.authService.signIn(reply, credentials)
  }

  @Post('/signup')
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiConflictResponse({ description: 'Username already exists' })
  @ApiCreatedResponse({ type: User, description: 'User created' })
  signUp(@Body() credentials: SignUpCredentialsDto) {
    return this.authService.signUp(credentials)
  }

  @Get('/refresh')
  @JwtAuthRefreshRequired()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({ description: 'New access token' })
  refresh(@GetUser() user: UserEntity, @Res() reply: FastifyReply) {
    return this.authService.refreshToken(reply, user)
  }

  @Get('/logout')
  @JwtAuthRequired()
  @ApiOperation({ summary: 'Log out an existing user' })
  @ApiOkResponse({ description: 'Successfully logged out' })
  async logout(@GetUser() user: UserEntity, @Res() reply: FastifyReply) {
    return this.authService.logout(reply, user)
  }
}
