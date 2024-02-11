import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import {allConfig} from './modules/config/configuration';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './jobs/cron/cron.service';
import { HttpModule } from '@nestjs/axios';
import { NoteModule } from './modules/note/note.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    MailerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [allConfig]
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    NoteModule,
    AuthModule,
  ],
  providers: [CronService],
})
export class AppModule {}
