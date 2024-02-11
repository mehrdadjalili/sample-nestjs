import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  //   @Cron('* * * * * *')
  //   handleCron() {
  //     this.logger.debug('Called when the current second is 45');
  //   }
}
