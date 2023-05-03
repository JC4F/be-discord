import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../schemas/user.schema';
import { Request } from 'express';
import { Model } from 'mongoose';

export interface IProcessPayLoad {
  userId: string;
  username: string;
}

// khong can expireIn => gui len server thi de cho jwt strategy authen duoc
export interface IAuthenResponse {
  userId: string;
  username: string | null;
  email: string;
  isVerified: boolean;
  accessToken: string;
}

export const processPayloadForJwtAndResponse = async (
  req: Request,
  userModel: Model<User>,
  payload: UserDocument,
  jwtService: JwtService,
): Promise<IAuthenResponse> => {
  const payloadForJwt: IProcessPayLoad = {
    userId: payload._id.toString(),
    username: payload.username,
  };
  const plainText = payload._id.toString() + Date.now();
  const accessToken = jwtService.sign(payloadForJwt);
  const refreshToken = bcrypt.hashSync(plainText, +process.env.SALTORROUNDS);

  await userModel.findOneAndUpdate({ _id: payload._id }, { refreshToken });

  req.res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return {
    userId: payload._id.toString(),
    username: payload.username ?? null,
    email: payload.email,
    isVerified: payload.isVerified,
    accessToken,
  };
};
