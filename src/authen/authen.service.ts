import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IRegisterUser } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(user: IRegisterUser): Promise<User> {
    const newUser = new this.userModel({
      email: user.email,
      username: user.username,
      password: user.password,
      isReceiveEmail: user.isReceiveEmail,
    });

    newUser.save();

    return;
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).lean();
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
