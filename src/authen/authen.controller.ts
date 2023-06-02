import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenService } from './authen.service';
import { IRegisterUser } from './dto/register-user.dto';
import { LocalAuthGuard } from './strategy/local/local-auth.guard';
import { JwtAuthGuard } from './strategy/jwt/jwt-auth.guard';
import { GoogleOAuthGuard } from './strategy/google/google-auth.guard';

@Controller('authen')
export class AuthenController {
  constructor(private authenService: AuthenService) {}

  @Post('register')
  async registerNewUser(
    @Req() req: Request,
    @Body() postRegisterUser: IRegisterUser,
  ) {
    return await this.authenService.registerUser(req, postRegisterUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async registerNewUsera(@Req() req: Request) {
    return await this.authenService.login(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Post('profile')
  GetUserProfile(@Req() req: Request) {
    return this.authenService.getUserDataFromRfTk(req);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    await this.authenService.googleLogin(req);
    res.redirect(`${process.env.REACT_APP_ORIGIN}/authen-redirect`);
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('refreshToken');
    res.end();
  }
}
