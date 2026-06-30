import { Body, Controller, Get, Logger, Post, Query, UnauthorizedException } from '@nestjs/common'

import { SocketService } from '../socket/socket.service'
import { RecordingReadyDto } from './dto/recording-ready.dto'
import { StreamAuthDto } from './dto/stream-auth.dto'
import { StreamWebhookDto } from './dto/stream-webhook.dto'
import { StreamService } from './stream.service'
import { Public } from '~/common/decorators/public.decorator'
import { PrismaService } from '~/prisma/prisma.service'

@Controller('stream')
export class StreamController {
  private readonly logger = new Logger(StreamController.name)

  constructor(
    private readonly streamService: StreamService,
    private readonly socketService: SocketService,
    private readonly prismaService: PrismaService,
  ) {}

  @Public()
  @Post('webhook/auth')
  async auth(@Body() body: StreamAuthDto) {
    const channel = await this.prismaService.channel.findFirst({
      where: { streamKey: body.token },
      include: { user: { select: { username: true } } },
    })

    if (!channel || channel.user.username !== body.path || channel.streamKey !== body.token) {
      throw new UnauthorizedException('Invalid stream key')
    }

    this.logger.log(`Successfully authenticated stream by user ${channel.id}`)
    return true
  }

  @Public()
  @Get('webhook/stream-start')
  async streamStart(@Query() query: StreamWebhookDto) {
    const streamKey = query.query.replace('token=', '')
    await this.streamService.handleStreamStart(streamKey)
  }

  @Public()
  @Get('webhook/stream-end')
  async streamEnd(@Query() query: StreamWebhookDto) {
    const streamKey = query.query.replace('token=', '')
    await this.streamService.handleStreamEnd(streamKey)
  }

  @Public()
  @Post('webhook/recording-ready')
  async recordingReady(@Body() body: RecordingReadyDto) {
    await this.streamService.handleRecordingReady(body)
  }
}
