import { IsString, MaxLength, MinLength } from 'class-validator'
import { Trim } from '~/common/decorators/normalize.decorators'

export class MessageSendDto {
  @Trim()
  @IsString()
  username!: string

  @Trim()
  @IsString()
  channelId!: string

  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  text!: string
}
