import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IRegisterUser } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import {
  processPayloadForJwtAndResponse,
  saveAndReturnUserInfo,
} from './utils';
import { IUserFromEmailStrategy } from './strategy/google/google.strategy';
import { LoginType, User } from 'src/db-schema/user.schema';
import { UserInfo, UserInfoDocument } from 'src/db-schema/user-info.schema';

@Injectable()
export class AuthenService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfo>,
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

    const newUser = await this.userModel.create({
      email: user.email,
      username: user.username,
      password: user.password,
      isReceiveEmail: user.isReceiveEmail,
    });

    const userInfoData = await saveAndReturnUserInfo(
      newUser,
      this.userInfoModel,
    );

    return await processPayloadForJwtAndResponse(
      req,
      this.userModel,
      userInfoData,
      this.jwtService,
    );
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email: email }).lean();

    if (user && user.password === pass) {
      return await this.userInfoModel
        .findOne({ user: user._id })
        .populate('user')
        .lean();
    }

    return null;
  }

  async login(req: Request) {
    return await processPayloadForJwtAndResponse(
      req,
      this.userModel,
      req.user as UserInfoDocument,
      this.jwtService,
    );
  }

  async googleLogin(req: Request) {
    const userFromGoogle = req.user as IUserFromEmailStrategy;
    if (!userFromGoogle) {
      throw new UnauthorizedException('Authen failed!');
      return;
    }
    const user = await this.userModel
      .findOne({ email: userFromGoogle.email })
      .lean();

    if (!user) {
      const newUser = await this.userModel.create({
        email: userFromGoogle.email,
        loginType: LoginType.GOOGLE,
      });

      const userInfoData = await saveAndReturnUserInfo(
        newUser,
        this.userInfoModel,
      );

      return await processPayloadForJwtAndResponse(
        req,
        this.userModel,
        userInfoData,
        this.jwtService,
      );
    }

    const existUser = await this.userInfoModel
      .findOne({ user: user._id })
      .populate('user');

    return await processPayloadForJwtAndResponse(
      req,
      this.userModel,
      existUser,
      this.jwtService,
    );
  }

  async getUserDataFromRfTk(req: Request) {
    const rfTk = JSON.parse(req.cookies['refreshToken']) as string;
    if (!rfTk) {
      throw new UnauthorizedException('Authen failed!');
      return;
    }

    const user = await this.userModel.findOne({ refreshToken: rfTk }).lean();

    if (!user) {
      throw new UnauthorizedException('Authen failed!');
      return;
    }

    const existUser = await this.userInfoModel
      .findOne({ user: user._id })
      .populate('user');

    return await processPayloadForJwtAndResponse(
      req,
      this.userModel,
      existUser,
      this.jwtService,
    );
  }
}
