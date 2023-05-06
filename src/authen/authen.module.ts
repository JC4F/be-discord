import { Module } from '@nestjs/common';
import { AuthenController } from './authen.controller';
import { AuthenService } from './authen.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local/local.strategy';
import { JwtStrategy } from './strategy/jwt/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategy/google/google.strategy';
import { DbSchemaModule } from 'src/db-schema/db-schema.module';

@Module({
  imports: [
    DbSchemaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30s' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthenController],
  providers: [AuthenService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthenService],
})
export class AuthenModule {}
