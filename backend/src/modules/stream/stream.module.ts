import { Module } from '@nestjs/common'

import { StreamController } from './stream.controller'
import { StreamResolver } from './stream.resolver'
import { StreamService } from './stream.service'

@Module({
  providers: [StreamResolver, StreamService],
  controllers: [StreamController],
})
export class StreamModule {}
