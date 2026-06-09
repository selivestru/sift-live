import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { RedisService } from '../redis/redis.service'
import { UserService } from '../user/user.service'
import { LoginInput } from './dto/login.input'
import { RegisterInput } from './dto/register.input'
import { verify } from 'argon2'
import ms, { StringValue } from 'ms'
import { createHash, randomBytes } from 'node:crypto'
import { EnvConfig } from '~/config/env.config'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<EnvConfig>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async register(input: RegisterInput) {
    const isExist = await this.userService.findByEmail(input.email)

    if (isExist) {
      throw new BadRequestException('User already exists')
    }

    const newUser = await this.userService.create(input.email, input.password, input.username)

    const { password, ...safeUser } = newUser

    const tokens = await this.signTokens(newUser.id, newUser.email)

    return { user: safeUser, ...tokens }
  }

  async login(input: LoginInput) {
    const user = await this.userService.findByEmail(input.email)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isValidPassword = await verify(user.password, input.password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const { password, ...safeUser } = user
    const tokens = await this.signTokens(user.id, user.email)

    return { user: safeUser, ...tokens }
  }

  async logout(refreshToken: string): Promise<boolean> {
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex')
    await this.redisService.del(`refresh:${tokenHash}`)
    return true
  }

  async refresh(refreshToken: string) {
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex')
    const data = await this.redisService.get(`refresh:${tokenHash}`)

    if (!data) {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    const { userId, email } = JSON.parse(data) as { userId: string; email: string }

    await this.redisService.del(`refresh:${tokenHash}`)

    return this.signTokens(userId, email)
  }

  private async signTokens(userId: string, email: string) {
    const refreshToken = randomBytes(32).toString('hex')

    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.getOrThrow<StringValue>('JWT_ACCESS_TTL'),
        },
      ),
      this.saveRefreshToken(userId, email, refreshToken),
    ])

    return { accessToken, refreshToken }
  }

  private async saveRefreshToken(userId: string, email: string, refreshToken: string) {
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex')
    const ttl = this.configService.getOrThrow<string>('JWT_REFRESH_TTL')
    const seconds = ms(ttl as StringValue) / 1000

    await this.redisService.set(
      `refresh:${tokenHash}`,
      JSON.stringify({ userId, email }),
      'EX',
      seconds,
    )
  }
}
