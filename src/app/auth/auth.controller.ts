import { Get, Post, Body, Controller, Res } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { FastifyReply } from 'fastify'

import { JwtUser } from '~/shared/types'
import { ApiCreate } from '~/shared/decorators'

import { User } from '../user/dto/user.dto'
import { GetUser } from '../user/decorators/user.decorator'
import { AuthService } from './auth.service'
import { JwtAuthRequired } from './decorators/jwt-auth.decorator'
import { JwtAuthRefreshRequired } from './decorators/jwt-auth-refresh.decorator'
import { LoginCredentialsDto, SignUpCredentialsDto } from './dto/auth.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ description: 'Successfully logged in' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiOperation({ summary: 'Sign in' })
  login(@Body() credentials: LoginCredentialsDto, @Res() reply: FastifyReply) {
    return this.authService.signIn(reply, credentials)
  }

  @Post('signup')
  @ApiCreate({ model: User, conflict: true })
  signUp(@Body() credentials: SignUpCredentialsDto) {
    return this.authService.signUp(credentials)
  }

  @Get('refresh')
  @JwtAuthRefreshRequired()
  @ApiOkResponse({ description: 'Access token has been refreshed' })
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@GetUser() user: JwtUser, @Res() reply: FastifyReply) {
    return this.authService.refreshToken(reply, user)
  }

  @Get('logout')
  @JwtAuthRequired()
  @ApiOkResponse({ description: 'Successfully logged out' })
  @ApiOperation({ summary: 'Log out' })
  logout(@GetUser() user: JwtUser, @Res() reply: FastifyReply) {
    return this.authService.logout(reply, user)
  }
}
