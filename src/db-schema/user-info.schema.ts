import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from './user.schema';

export type UserInfoDocument = HydratedDocument<UserInfo>;

@Schema({ collection: 'user_info', timestamps: false })
export class UserInfo {
  @Prop()
  imageUrl: string;

  @Prop()
  phone: string;

  @Prop()
  joinDate: Date;

  @Prop()
  dob: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: UserDocument;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
