import { Module } from '@nestjs/common';
import { UserInfoController } from './user-info.controller';
import { UserInfoService } from './user-info.service';
import { DbSchemaModule } from 'src/db-schema/db-schema.module';

@Module({
  imports: [DbSchemaModule],
  controllers: [UserInfoController],
  providers: [UserInfoService],
})
export class UserInfoModule {}
