import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MailerService } from '../mailer/mailer.service';
import { generate as otp } from 'otp-generator';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VerifyCodeService {
  constructor(
    private readonly db: DatabaseService,
    private readonly mailer: MailerService,
  ) {}

  async createAndSend(
    userId: number,
    email: string,
    deviceName?: string,
  ): Promise<string> {
    var code = otp(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    var verify = await this.db.verifyCode.create({
      data: {
        userId,
        deviceName,
        token: uuidv4(),
        code,
      },
    });

    this.mailer.sendVerifyCode(email, code);

    return verify.token;
  }

  async verifyCodeCompare(token: string, code: string) {
    const verify = await this.db.verifyCode.findUnique({
      where: { token },
    });

    if (verify.wrongCount > 2) {
      await this.db.verifyCode.delete({
        where: {
          id: verify.id,
        },
      });
      throw new BadRequestException('wrong code');
    }

    if (verify.code != code) {
      await this.db.verifyCode.update({
        where: {
          id: verify.id,
        },
        data: {
          wrongCount: {
            increment: 1,
          },
        },
      });
      throw new BadRequestException('wrong code');
    }

    await this.db.verifyCode.delete({
      where: {
        id: verify.id,
      },
    });

    return verify;
  }

  async resendCode(token: string) {
    const verify = await this.db.verifyCode.findUnique({
      where: { token },
    });

    const user = await this.db.user.findUnique({
      where: { id:verify.userId },
    })

    this.mailer.sendVerifyCode(user.email, verify.code);

    return "ok";
  }
}
