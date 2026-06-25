import { HttpService } from '@nestjs/axios'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Job } from 'bullmq'
import { readdir, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { EnvConfig } from '~/config/env.config'
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
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {
    super()
  }

  async process(job: Job<StreamProcessingJobData>): Promise<void> {
    const { channelId, username } = job.data

    try {
      await this.findAndSendToTranscoder(channelId, username)
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

  private async findAndSendToTranscoder(channelId: string, username: string): Promise<void> {
    const recordingsHostPath = this.configService.getOrThrow<string>('RECORDINGS_HOST_PATH')
    const transcoderUrl = this.configService.getOrThrow<string>('TRANSCODER_URL')

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

    const containerPath = `/recordings/${username}/${latestFile.name}`

    this.logger.log(`Sending recording to transcoder: ${containerPath}`)

    await this.httpService.axiosRef.post(`${transcoderUrl}/convert`, {
      recordingPath: containerPath,
      streamId: stream.id,
      channelId,
    })
  }

  private async cleanupRecording(username: string): Promise<void> {
    const recordingsHostPath = this.configService.getOrThrow<string>('RECORDINGS_HOST_PATH')
    const dirPath = join(recordingsHostPath, username)

    this.logger.log(`Cleaning up recordings in ${dirPath}`)
    await rm(dirPath, { recursive: true, force: true })
  }
}
