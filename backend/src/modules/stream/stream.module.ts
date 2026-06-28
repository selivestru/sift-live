import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'

import { TranscoderModule } from '../transcoder/transcoder.module'
import { StreamProcessingConsumer } from './stream-processing.consumer'
import { StreamController } from './stream.controller'
import { StreamService } from './stream.service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'stream-processing',
    }),
    TranscoderModule,
  ],
  controllers: [StreamController],
  providers: [StreamService, StreamProcessingConsumer],
})
export class StreamModule {}
