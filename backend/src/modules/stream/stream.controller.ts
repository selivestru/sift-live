import { Body, Controller, Post } from '@nestjs/common'

import { SocketService } from '../socket/socket.service'
import { WebhookStreamDto } from './dto/webhook-stream.dto'
import { StreamService } from './stream.service'
import { Public } from '~/common/decorators/public.decorator'
import { PrismaService } from '~/prisma/prisma.service'

@Controller('stream')
export class StreamController {
  constructor(
    private readonly streamService: StreamService,
    private readonly socketService: SocketService,
    private readonly prismaService: PrismaService,
  ) {}

  @Public()
  @Post('webhook/stream-ready')
  async streamReady(@Body() body: WebhookStreamDto) {
    console.debug('streamReady', body)

    const streamKey = body.path.split('/')[1]

    const channel = await this.prismaService.channel.findFirst({
      where: { streamKey },
      select: { id: true },
    })

    if (!channel) {
      console.error('Channel not found', streamKey)
      return
    }

    await this.prismaService.channel.update({
      where: { id: channel.id },
      data: { isLive: true },
    })

    this.socketService.emitUsersChannelOnline(channel.id)
  }

  @Public()
  @Post('webhook/stream-ended')
  async streamEnded(@Body() body: WebhookStreamDto) {
    console.debug('StreamEnded', body)

    const streamKey = body.path.split('/')[1]

    const channel = await this.prismaService.channel.findFirst({
      where: { streamKey },
      select: { id: true },
    })

    if (!channel) {
      console.error('Channel not found', streamKey)
      return
    }

    await this.prismaService.channel.update({
      where: { id: channel.id },
      data: { isLive: false },
    })

    this.socketService.emitUsersChannelOffline(channel.id)
  }
}
