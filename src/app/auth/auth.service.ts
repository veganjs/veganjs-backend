import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserService } from '../user/user.service'
import {
  LoginCredentialsDto,
  SignUpCredentialsDto,
} from './dto/auth-credentials.dto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(credentials: LoginCredentialsDto) {
    const user = await this.userService.validateUserPassword(credentials)

    if (!user?.username) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const accessToken = this.jwtService.sign({
      userId: user.id,
      username: user.username,
    })

    return { accessToken }
  }

  async signUp(credentials: SignUpCredentialsDto) {
    return this.userService.createUser(credentials)
  }
}
