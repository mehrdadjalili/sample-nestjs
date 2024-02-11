import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { RefreshAuthDto } from './dtos/refresh_auth.dto';
import { ResendCodeDto } from './dtos/resend_verify_code.dto';
import { ResetPasswordDto } from './dtos/reset_password.dto';
import { EmailDto } from './dtos/email.dto';
import { VerifyLoginDto } from './dtos/verify_login.dto';
import { LoginDto } from './dtos/login.dto';
import {
  CreatePasswordHash,
  PasswordHashCompare,
} from 'src/utils/password_hash';
import { VerifyCodeService } from './verify_code.service';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtConfig } from '../config/configuration';
import {
  UserJwtPayload,
  UserJwtTokenType,
} from 'src/entity/jwt/user_jwt_payload';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly verifyService: VerifyCodeService,
    private readonly configService: ConfigService,
  ) {}

  async existsPhoneNumber(body: EmailDto) {
    const q = await this.db.user.count({
      where: { email: body.email },
    });

    return q > 0;
  }

  async register(body: RegisterDto) {
    const count = await this.db.user.count({
      where: { email: body.email },
    });

    if (count > 0) {
      throw new BadRequestException('The email already exists!');
    }

    var password = await CreatePasswordHash(body.password);

    var user = await this.db.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: password,
      },
    });

    const token = await this.verifyService.createAndSend(
      Number(user.id),
      user.email,
      body.deviceName,
    );

    return token;
  }

  async login(body: LoginDto) {
    const users = await this.db.user.findMany({
      where: {
        email: body.email,
        status: {in: ['ACTIVE', 'UNVERIFIED']},
      },
    });

    if (users.length != 1) {
      throw new BadRequestException(
        'The user does not exist or the password is incorrect!',
      );
    }

    const user = users[0];

    const isMatch = await PasswordHashCompare(body.password, user.password);
    if (!isMatch) {
      throw new BadRequestException(
        'The user does not exist or the password is incorrect!',
      );
    }

    const token = await this.verifyService.createAndSend(
      user.id,
      user.email,
      body.deviceName,
    );

    return token;
  }

  async verifyLogin(body: VerifyLoginDto, ip: string) {
    const verify = await this.verifyService.verifyCodeCompare(
      body.verifyToken,
      body.verifyCode,
    );

    var user = await this.db.user.findUniqueOrThrow({
      where: {
        id: verify.userId,
        status: {in: ['ACTIVE', 'UNVERIFIED']},
      },
    });

    const isMatch = await PasswordHashCompare(
      body.password, 
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException(
        'The user does not exist or the password is incorrect!',
      );
    }

    if (user.status === 'UNVERIFIED') {
      user = await this.db.user.update({
        where: { id: user.id },
        data: { status: 'ACTIVE' },
      });
    }

    var session = await this.db.session.create({
      data: {
        userId: user.id,
        deviceName: verify.deviceName,
        lastIp: ip,
      },
    });

    const jwtConfig = this.configService.get<JwtConfig>('jwt');

    var refresh = jwt.sign(
      <UserJwtPayload>{
        userId: user.id,
        sessionId: session.id,
        role: user.role,
        type: UserJwtTokenType.REFRESH,
      },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.refresh_expire_time,
      },
    );

    var access = jwt.sign(
      <UserJwtPayload>{
        userId: user.id,
        sessionId: session.id,
        role: user.role,
        type: UserJwtTokenType.ACCESS,
      },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.access_expire_time,
      },
    );

    delete user.password;

    return {
      user,
      tokens: {
        refresh,
        access,
      },
    };
  }

  async forgotPassword(body: EmailDto) {
    const users = await this.db.user.findMany({
      where: {
        email: body.email,
        status: 'ACTIVE',
      },
    });

    if (users.length != 1) {
      throw new BadRequestException('User not found!');
    }

    const user = users[0];

    const token = await this.verifyService.createAndSend(user.id, user.email);

    return token;
  }

  async resetPassword(body: ResetPasswordDto) {
    const verify = await this.verifyService.verifyCodeCompare(
      body.verifyToken,
      body.verifyCode,
    );

    var user = await this.db.user.findUnique({
      where: {
        id: verify.userId,
        status: 'ACTIVE',
      },
    });

    var password = await CreatePasswordHash(body.password);

    await this.db.user.update({
      where: { id: user.id },
      data: { password },
    });

    return 'ok';
  }

  async resendVerifyCode(body: ResendCodeDto) {
    try {
      await this.verifyService.resendCode(body.verifyToken);
      return 'ok';
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async refresh(body: RefreshAuthDto) {
    try {
      const jwtConfig = this.configService.get<JwtConfig>('jwt');

      const jwtVerify = jwt.verify(body.token, jwtConfig.secret);

      var verify = jwtVerify as UserJwtPayload;

      if (verify.type !== UserJwtTokenType.REFRESH) {
        throw new BadRequestException('inavlid token!');
      }

      var user = await this.db.user.findUnique({
        where: {
          id: verify.userId,
          status: 'ACTIVE',
        },
      });

      var access = jwt.sign(
        <UserJwtPayload>{
          userId: user.id,
          sessionId: verify.sessionId,
          role: user.role,
          type: UserJwtTokenType.ACCESS,
        },
        jwtConfig.secret,
        {
          expiresIn: jwtConfig.access_expire_time,
        },
      );

      return { access };
    } catch (error) {
      throw new BadRequestException('inavlid token!');
    }
  }

  async logout(sessionId: number) {
    var session = await this.db.session.findUnique({
      where: { id: sessionId },
    });

    await this.db.session.update({
      where: { id: session.id },
      data: { status: false, isOnline: false },
    });

    return 'ok';
  }
}
