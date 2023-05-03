import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthenService } from './authen.service';
import { IRegisterUser } from './dto/register-user.dto';
import { LocalAuthGuard } from './local/local-auth.guard';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('authen')
export class AuthenController {
  constructor(private authenService: AuthenService) {}

  @Post('/register')
  async registerNewUser(
    @Req() req: Request,
    @Body() postRegisterUser: IRegisterUser,
  ) {
    return await this.authenService.registerUser(req, postRegisterUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async registerNewUsera(@Req() req) {
    return this.authenService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
