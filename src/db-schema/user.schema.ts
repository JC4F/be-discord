import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum LoginType {
  NORMAL = 'NORMAL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}

enum RoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'user' })
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop({ type: String, enum: LoginType, default: LoginType.NORMAL })
  loginType: LoginType;

  @Prop({ type: String, enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isReceiveEmail: boolean;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
