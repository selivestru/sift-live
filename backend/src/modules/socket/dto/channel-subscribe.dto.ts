import { IsString } from 'class-validator'
import { Trim } from '~/common/decorators/normalize.decorators'

export class ChannelSubscribeDto {
  @Trim()
  @IsString()
  channelId!: string
}
