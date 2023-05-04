import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { LoginType, User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IRegisterUser } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { processPayloadForJwtAndResponse } from './utils';
import { IUserFromEmailStrategy } from './strategy/google/google.strategy';

@Injectable()
export class AuthenService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(req: Request, user: IRegisterUser): Promise<any> {
    // check unique username
    const userExist = await this.userModel
      .findOne({ $or: [{ username: user.username }, { email: user.email }] })
      .lean();

    if (userExist && userExist.username === user.username) {
      throw new ConflictException('Username already exists!');
      return;
    } else if (userExist && userExist.email === user.email) {
      throw new ConflictException('Email already exists!');
      return;
    }

    const newUser = new this.userModel({
      email: user.email,
      username: user.username,
      password: user.password,
      isReceiveEmail: user.isReceiveEmail,
    });

    const resultUser: UserDocument = await newUser.save();
    return processPayloadForJwtAndResponse(
      req,
      this.userModel,
      resultUser,
      this.jwtService,
    );
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).lean();
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  login(req: Request) {
    return processPayloadForJwtAndResponse(
      req,
      this.userModel,
      req.user as UserDocument,
      this.jwtService,
    );
  }

  async googleLogin(req: Request) {
    const user = req.user as IUserFromEmailStrategy;
    if (!user) {
      throw new UnauthorizedException('Something wrong with google login!');
      return;
    }

    const existUser = await this.userModel.findOne({ email: user.email });

    if (!existUser) {
      const newUser = new this.userModel({
        email: user.email,
        loginType: LoginType.GOOGLE,
      });

      const resultUser: UserDocument = await newUser.save();
      return processPayloadForJwtAndResponse(
        req,
        this.userModel,
        resultUser,
        this.jwtService,
      );
    }

    return processPayloadForJwtAndResponse(
      req,
      this.userModel,
      existUser,
      this.jwtService,
    );
  }
}
