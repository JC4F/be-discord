import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IProcessPayLoad } from '../../utils';

interface IPayloadExtractFromJwt {
  userId: string;
  username: string;
  exp: number;
  iat: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: IPayloadExtractFromJwt): Promise<IProcessPayLoad> {
    return { userId: payload.userId, username: payload.username };
  }
}
