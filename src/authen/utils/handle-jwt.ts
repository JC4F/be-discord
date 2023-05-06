import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/db-schema/user.schema';
import { UserInfo } from 'src/db-schema/user-info.schema';

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
  dob: string;
  imageUrl: string;
  phone: string | null;
  joinDate: string;
  accessToken: string;
}

export const processPayloadForJwtAndResponse = async (
  req: Request,
  userModel: Model<User>,
  userInfo: UserInfo,
  jwtService: JwtService,
): Promise<IAuthenResponse> => {
  const payloadForJwt: IProcessPayLoad = {
    userId: userInfo.user._id.toString(),
    username: userInfo.user.username,
  };
  const plainText = userInfo.user._id.toString() + Date.now();
  const accessToken = jwtService.sign(payloadForJwt);
  const refreshToken = bcrypt.hashSync(plainText, +process.env.SALTORROUNDS);

  await userModel.findOneAndUpdate(
    { _id: userInfo.user._id },
    { refreshToken },
  );

  req.res.cookie('refreshToken', JSON.stringify(refreshToken), {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return {
    userId: userInfo.user._id.toString(),
    username: userInfo.user.username ?? null,
    email: userInfo.user.email,
    isVerified: userInfo.user.isVerified,
    imageUrl: userInfo.imageUrl,
    dob: userInfo.dob.toDateString(),
    joinDate: userInfo.joinDate.toDateString(),
    phone: userInfo.phone ?? null,
    accessToken,
  };
};

// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';
// import { Model } from 'mongoose';
// import { User, UserDocument } from 'src/db-schema/user.schema';
// import { UserInfoDocument } from 'src/db-schema/user-info.schema';

// export interface IProcessPayLoad {
//   userId: string;
//   username: string;
// }

// // khong can expireIn => gui len server thi de cho jwt strategy authen duoc
// export interface IAuthenResponse {
//   userId: string;
//   username: string | null;
//   email: string;
//   isVerified: boolean;
//   dob: string;
//   imageUrl: string;
//   phone: string | null;
//   joinDate: string;
//   accessToken: string;
// }

// export const processPayloadForJwtAndResponse = async (
//   req: Request,
//   userModel: Model<User>,
//   user: UserDocument,
//   userInfo: UserInfoDocument,
//   jwtService: JwtService,
// ): Promise<IAuthenResponse> => {
//   console.log('>>check payload', userInfo);
//   const payloadForJwt: IProcessPayLoad = {
//     userId: user._id.toString(),
//     username: user.username,
//   };
//   const plainText = userInfo._id.toString() + Date.now();
//   const accessToken = jwtService.sign(payloadForJwt);
//   const refreshToken = bcrypt.hashSync(plainText, +process.env.SALTORROUNDS);

//   await userModel.findOneAndUpdate({ _id: userInfo._id }, { refreshToken });

//   req.res.cookie('refreshToken', JSON.stringify(refreshToken), {
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000,
//   });

//   return {
//     userId: userInfo._id.toString(),
//     username: userInfo.user.username ?? null,
//     email: userInfo.user.email,
//     isVerified: userInfo.user.isVerified,
//     imageUrl: userInfo.imageUrl,
//     dob: userInfo.dob.toDateString(),
//     joinDate: userInfo.joinDate.toDateString(),
//     phone: userInfo.phone ?? null,
//     accessToken,
//   };
// };
