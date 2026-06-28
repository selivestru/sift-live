import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Job } from 'bullmq'
import { readdir, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { EnvConfig } from '~/config/env.config'
import { TranscoderService } from '~/modules/transcoder/transcoder.service'
import { PrismaService } from '~/prisma/prisma.service'

const QUEUE_NAME = 'stream-processing'

interface StreamProcessingJobData {
  channelId: string
  username: string
}

@Processor(QUEUE_NAME)
export class StreamProcessingConsumer extends WorkerHost {
  private readonly logger = new Logger(StreamProcessingConsumer.name)

  constructor(
    private readonly prismaService: PrismaService,
    private readonly transcoderService: TranscoderService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {
    super()
  }

  async process(job: Job<StreamProcessingJobData>): Promise<void> {
    const { channelId, username } = job.data

    try {
      await this.processRecording(channelId, username)
    } catch (error: unknown) {
      const maxAttempts = job.opts.attempts ?? 3

      if (job.attemptsMade >= maxAttempts) {
        this.logger.error(
          `All ${String(maxAttempts)} attempts failed for channel ${channelId}, cleaning up recording`,
        )
        await this.cleanupRecording(username).catch(() => {})
      }

      throw error
    }
  }

  private async processRecording(channelId: string, username: string): Promise<void> {
    const recordingsHostPath = this.configService.getOrThrow<string>('RECORDINGS_HOST_PATH')

    const stream = await this.prismaService.stream.findFirst({
      where: { channelId, endedAt: null },
      orderBy: { startedAt: 'desc' },
      select: { id: true },
    })

    if (!stream) {
      this.logger.warn(`No active stream found for channel ${channelId}`)
      return
    }

    const dirPath = join(recordingsHostPath, username)
    const files = await readdir(dirPath).catch(() => [] as string[])

    if (files.length === 0) {
      this.logger.warn(`No recording files found in ${dirPath}`)
      return
    }

    const fileStats = await Promise.all(
      files.map(async (name) => {
        const stats = await stat(join(dirPath, name))
        return { name, mtime: stats.mtimeMs }
      }),
    )

    const latestFile = fileStats.sort((a, b) => b.mtime - a.mtime)[0]
    const recordingPath = join(recordingsHostPath, username, latestFile.name)

    this.logger.log(`Processing recording: ${recordingPath}`)

    const { duration, posterUrl } = await this.transcoderService.processRecording(
      recordingPath,
      stream.id,
      channelId,
    )

    const publicUrl = this.configService.getOrThrow<string>('MINIO_PUBLIC_URL')
    const bucket = this.configService.getOrThrow<string>('MINIO_BUCKET')
    const baseUrl = `${publicUrl}/${bucket}/${channelId}/${stream.id}`
    const videoUrl = `${baseUrl}/playlist.m3u8`
    const fullPosterUrl = posterUrl ? `${publicUrl}/${bucket}/${posterUrl}` : null

    await this.prismaService.stream.update({
      where: { id: stream.id },
      data: { endedAt: new Date(), duration, videoUrl, posterUrl: fullPosterUrl },
    })

    this.logger.log(`Recording ready for stream: ${stream.id}, duration: ${String(duration)}s`)
  }

  private async cleanupRecording(username: string): Promise<void> {
    const recordingsHostPath = this.configService.getOrThrow<string>('RECORDINGS_HOST_PATH')
    const dirPath = join(recordingsHostPath, username)

    this.logger.log(`Cleaning up recordings in ${dirPath}`)
    await rm(dirPath, { recursive: true, force: true })
  }
}
