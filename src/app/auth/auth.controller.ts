import { Post, Body, Controller } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger'

import { AuthService } from './auth.service'
import {
  AuthToken,
  LoginCredentialsDto,
  SignUpCredentialsDto,
} from './dto/auth-credentials.dto'

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Sign in' })
  @ApiCreatedResponse({ type: AuthToken, description: 'Generated auth token' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  login(@Body() credentials: LoginCredentialsDto) {
    return this.authService.signIn(credentials)
  }

  @Post('/signup')
  @ApiOperation({ summary: 'Sign up' })
  @ApiCreatedResponse({ description: 'User created' })
  signUp(@Body() credentials: SignUpCredentialsDto) {
    return this.authService.signUp(credentials)
  }
}
