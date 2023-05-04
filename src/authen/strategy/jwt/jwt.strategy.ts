import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthenService } from 'src/authen/authen.service';

interface IPayloadExtractFromJwt {
  userId: string;
  username: string;
  exp: number;
  iat: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authenService: AuthenService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IPayloadExtractFromJwt): Promise<any> {
    // Check if the access token is expired
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTimeInSeconds) {
      const userData = await this.authenService.getUserDataFromRfTk(req);
      req.res.setHeader(
        'WWW-Authenticate',
        'Bearer realm="example.com", error="invalid_token", error_description="The access token has expired. Use the refresh token to obtain a new access token."',
      );
      req.res.status(401).json({ userData });
      return;
    }
    return {
      userId: payload.userId,
      username: payload.username,
    };
  }
}
