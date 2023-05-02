import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IRegisterUser } from './dto/register-user.dto';

@Injectable()
export class AuthenService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
}
