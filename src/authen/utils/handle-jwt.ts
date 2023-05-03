import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../schemas/user.schema';

export interface IProcessPayLoad {
  userId: string;
  username: string;
}

// khong can expireIn => gui len server thi de cho jwt strategy authen duoc
export interface IAuthenResponse {
  userId: string;
  username: string;
  email: string;
  isVerified: boolean;
  accessToken: string;
}

export const processPayloadForJwtAndResponse = (
  payload: UserDocument,
  jwtService: JwtService,
): IAuthenResponse => {
  const payloadForJwt: IProcessPayLoad = {
    userId: payload._id.toString(),
    username: payload.username,
  };

  const accessToken = jwtService.sign(payloadForJwt);

  return {
    userId: payload._id.toString(),
    username: payload.username,
    email: payload.email,
    isVerified: payload.isVerified,
    accessToken,
  };
};
