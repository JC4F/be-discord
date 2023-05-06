import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInfo, UserInfoSchema } from './user-info.schema';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserInfo.name, schema: UserInfoSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DbSchemaModule {}
