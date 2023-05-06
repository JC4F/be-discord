import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenModule } from './authen/authen.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInfoModule } from './user-info/user-info.module';
import { DbSchemaModule } from './db-schema/db-schema.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.development`],
      validationSchema: configValidationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_CONNECTION'),
      }),
      inject: [ConfigService],
    }),
    AuthenModule,
    UserInfoModule,
    DbSchemaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
