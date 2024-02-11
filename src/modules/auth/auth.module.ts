import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { VerifyCodeService } from './verify_code.service';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  providers: [AuthService, VerifyCodeService],
  controllers: [AuthController],
  imports: [
    DatabaseModule,
    MailerModule,
  ],
})
export class AuthModule {}
