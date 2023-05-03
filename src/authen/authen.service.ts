import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IRegisterUser } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { processPayloadForJwtAndResponse } from './utils';

@Injectable()
export class AuthenService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(req: Request, user: IRegisterUser): Promise<any> {
    const newUser = new this.userModel({
      email: user.email,
      username: user.username,
      password: user.password,
      isReceiveEmail: user.isReceiveEmail,
    });

    const resultUser: UserDocument = await newUser.save();
    return processPayloadForJwtAndResponse(resultUser, this.jwtService);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).lean();
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async login(user: UserDocument) {
    return processPayloadForJwtAndResponse(user, this.jwtService);
  }
}
