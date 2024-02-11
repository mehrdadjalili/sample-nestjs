import { Body, Controller, Get, Ip, Post } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { VerifyLoginDto } from './dtos/verify_login.dto';
import { EmailDto } from './dtos/email.dto';
import { ResetPasswordDto } from './dtos/reset_password.dto';
import { RefreshAuthDto } from './dtos/refresh_auth.dto';
import { ResendCodeDto } from './dtos/resend_verify_code.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.service.register(body);
  }

  @Post('exists-phone-number')
  async existsPhoneNumber(@Body() body: EmailDto) {
    return this.service.existsPhoneNumber(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.service.login(body);
  }

  @Post('verify-login')
  async verifyLogin(@Body() body: VerifyLoginDto, @Ip() ip: string) {
    return this.service.verifyLogin(body, ip);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: EmailDto) {
    return this.service.forgotPassword(body);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.service.resetPassword(body);
  }

  @Post('resend-verify-code')
  async resendVerifyCode(@Body() body: ResendCodeDto) {
    return this.service.resendVerifyCode(body);
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshAuthDto) {
    return this.service.refresh(body);
  }

  @Get('logout')
  async logout(@Body() body: RefreshAuthDto) {
    return this.service.logout(0);
  }
}
