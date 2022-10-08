import { Get, Post, Body, Controller, Res } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { FastifyReply } from 'fastify'

import { JwtUser } from '~/shared/types'
import { ErrorResponse } from '~/shared/error'
import { ApiCreate } from '~/shared/lib/crud-decorators'

import { UserDto } from '../user/dto/user.dto'
import { GetUser } from '../user/decorators/user.decorator'
import { AuthService } from './auth.service'
import { JwtAuthRequired } from './decorators/jwt-auth.decorator'
import { JwtAuthRefreshRequired } from './decorators/jwt-auth-refresh.decorator'
import { LoginCredentialsDto } from './dto/login.dto'
import { SignUpCredentialsDto } from './dto/sign-up.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiNoContentResponse({ description: 'Successfully logged in' })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description: 'Invalid credentials',
  })
  @ApiOperation({ summary: 'Sign in' })
  login(@Body() credentials: LoginCredentialsDto, @Res() reply: FastifyReply) {
    return this.authService.signIn(reply, credentials)
  }

  @Post('signup')
  @ApiCreate({ model: UserDto, conflict: true })
  signUp(@Body() credentials: SignUpCredentialsDto) {
    return this.authService.signUp(credentials)
  }

  @Get('refresh')
  @JwtAuthRefreshRequired()
  @ApiNoContentResponse({ description: 'Access token has been refreshed' })
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@GetUser() user: JwtUser, @Res() reply: FastifyReply) {
    return this.authService.refreshToken(reply, user)
  }

  @Get('logout')
  @JwtAuthRequired()
  @ApiNoContentResponse({ description: 'Successfully logged out' })
  @ApiOperation({ summary: 'Log out' })
  logout(@GetUser() user: JwtUser, @Res() reply: FastifyReply) {
    return this.authService.logout(reply, user)
  }
}
