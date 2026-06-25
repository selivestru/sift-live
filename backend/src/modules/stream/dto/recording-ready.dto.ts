import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class RecordingReadyDto {
  @IsString()
  streamId!: string

  @IsString()
  channelId!: string

  @IsInt()
  @Min(0)
  duration!: number

  @IsOptional()
  @IsString()
  posterUrl?: string | null
}
