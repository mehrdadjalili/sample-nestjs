import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmtpConfig } from '../config/configuration';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  constructor(private configService: ConfigService) {}

  async sendVerifyCode(email: string, code: string) {
    const html = `<h1>your verify code is: ${code}</h1>`;
    return this.sendEmail(email, 'Verify Code', html);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      const config = this.configService.get<SmtpConfig>('smtp');

      const transporter = nodemailer.createTransport({
        host: config.host,
        port: Number(config.port),
        secure: false,
        auth: {
          user: config.user,
          pass: config.password,
        },
      });

      await transporter.sendMail({
        from: config.from,
        to,
        subject,
        html,
      });
    } catch (error) {}
  }
}
