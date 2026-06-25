import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { HttpModule } from '@nestjs/axios'
import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { JwtModule } from '@nestjs/jwt'

import { AppResolver } from './app.resolver'
import { GqlContext } from './common/interfaces/gql-context.interface'
import envConfig from './config/env.config'
import { AuthModule } from './modules/auth/auth.module'
import { AuthGuard } from './modules/auth/guards/auth.guard'
import { ChannelModule } from './modules/channel/channel.module'
import { RedisModule } from './modules/redis/redis.module'
import { SocketModule } from './modules/socket/socket.module'
import { StreamModule } from './modules/stream/stream.module'
import { UserModule } from './modules/user/user.module'
import { PrismaModule } from './prisma/prisma.module'
import { join } from 'path'
import { EnvConfig } from '~/config/env.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig>) => ({
        connection: {
          url: config.getOrThrow<string>('REDIS_URL'),
        },
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      graphiql: true,
      context: ({ req, res }: GqlContext) => ({ req, res }),
    }),
    JwtModule.register({ global: true }),
    HttpModule.register({
      global: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    RedisModule,
    ChannelModule,
    SocketModule,
    StreamModule,
  ],
  controllers: [],
  providers: [
    AppResolver,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
