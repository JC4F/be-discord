import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthenService } from './authen.service';
import { IRegisterUser } from './dto/register-user.dto';
import { LocalAuthGuard } from './strategy/local/local-auth.guard';
import { JwtAuthGuard } from './strategy/jwt/jwt-auth.guard';
import { UserDocument } from './schemas/user.schema';

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
  async registerNewUsera(@Req() req: Request) {
    return this.authenService.login(req.user as UserDocument);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
