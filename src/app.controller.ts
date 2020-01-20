import { Controller, Get, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { generateRsaKeys } from './utils/rsa';
import { RegisterBodyDto } from './register-body.dto';

@Controller('api')
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('sign-in')
  async signIn(@Body() registerBody: RegisterBodyDto) {
    const { email, password } = registerBody;
    this.userService.addUser({ password }, email);

    return this.authService.login(registerBody);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('generate-key-pair')
  generateKeyPair(@Request() req) {
    const { email } = req.user;
    const keys = generateRsaKeys();
    this.userService.addPublicKey(email, keys.publicKey);

    return keys;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('encrypt')
  encrypt(@Request() req) {
    const userEmail = req.user;
    return this.userService.encrypt(userEmail);
  }
}
