import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthenService } from './authen.service';
import { IRegisterUser } from './dto/register-user.dto';
import { LocalAuthGuard } from './local/local-auth.guard';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('authen')
export class AuthenController {
  constructor(private authenService: AuthenService) {}

  @Post('/register')
  async registerNewUser(@Body() postRegisterUser: IRegisterUser) {
    await this.authenService.registerUser(postRegisterUser);

    return { accessToken: 'access_token' };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async registerNewUsera(@Request() req) {
    return this.authenService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
