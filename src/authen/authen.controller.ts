import { Controller, Post, Body } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { IRegisterUser } from './dto/register-user.dto';

@Controller('authen')
export class AuthenController {
  constructor(private authenService: AuthenService) {}

  @Post('/register')
  async registerNewUsera(@Body() postRegisterUser: IRegisterUser) {
    await this.authenService.registerUser(postRegisterUser);

    return { accessToken: 'access_token' };
  }
}
