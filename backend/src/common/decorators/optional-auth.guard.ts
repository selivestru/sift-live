import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'

import { AuthPayload } from '../interfaces/auth-payload.interface'
import { type Request } from 'express'
import { GqlContext } from '~/common/interfaces/gql-context.interface'
import { EnvConfig } from '~/config/env.config'

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<EnvConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext<GqlContext>()

    const token = this.extractTokenFromHeader(req)

    if (token) {
      try {
        const payload: AuthPayload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
          issuer: this.configService.getOrThrow<string>('JWT_ACCESS_ISSUER'),
          audience: this.configService.getOrThrow<string>('JWT_ACCESS_AUDIENCE'),
        })

        req.user = payload
      } catch {
        //
      }
    }

    return true
  }

  private extractTokenFromHeader(req: Request): string | null {
    const [type, token] = req.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : null
  }
}
