import { IsIn, IsString } from 'class-validator'

export class WebhookStreamDto {
  @IsString()
  @IsIn(['stream_started', 'stream_stopped'], { message: 'Invalid event' })
  event!: string

  @IsString()
  path!: string
}
