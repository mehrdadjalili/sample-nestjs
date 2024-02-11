import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { UserJwtPayload } from 'src/entity/jwt/user_jwt_payload';
import { JwtConfig } from 'src/modules/config/configuration';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { USER_ROLE_KEY } from './api-auth.decorator';
import { UserRole } from '@prisma/client';

@Injectable()
export class ApiAuthGuard implements CanActivate {
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(DatabaseService) private readonly db: DatabaseService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    
    try {
      const jwtConfig = this.configService.get<JwtConfig>('jwt');

      const jwtVerify = jwt.verify(token, jwtConfig.secret);

      var payload = jwtVerify as UserJwtPayload;

      const user = await this.db.user.findUnique({
        where: { id: payload.userId },
      });

      if (user.status !== 'ACTIVE') {
        throw new UnauthorizedException();
      }

      const session = await this.db.session.findUnique({
        where: { id: payload.sessionId },
      });

      if (!session.status) {
        throw new UnauthorizedException();
      }

      const roles = this.reflector.getAllAndOverride<UserRole[] | undefined>(
        USER_ROLE_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (roles !== undefined && roles.length > 0) {
        if (!roles.find((role) => role === user.role)) {
          return false;
        }
      }

      request['user'] = user;
      request['session'] = session;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
