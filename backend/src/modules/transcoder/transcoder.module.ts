import { Module } from '@nestjs/common'

import { TranscoderService } from './transcoder.service'

@Module({
  controllers: [],
  providers: [TranscoderService],
  exports: [TranscoderService],
})
export class TranscoderModule {}
