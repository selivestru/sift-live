import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Client as MinioClient } from 'minio'
import { execFile } from 'node:child_process'
import { createReadStream } from 'node:fs'
import { mkdir, readdir, rm, stat, unlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { EnvConfig } from '~/config/env.config'

const execFileAsync = promisify(execFile)

const CONTENT_TYPES: Record<string, string> = {
  '.m3u8': 'application/vnd.apple.mpegurl',
  '.m4s': 'video/iso.segment',
  '.mp4': 'video/mp4',
  '.webp': 'image/webp',
}

export interface ProcessRecordingResult {
  duration: number
  posterUrl: string | null
}

@Injectable()
export class TranscoderService implements OnModuleInit {
  private readonly logger = new Logger(TranscoderService.name)
  private readonly tmpDir = join(tmpdir(), 'sift-transcoder')

  private readonly minioClient: MinioClient
  private readonly bucket: string

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    const endpoint = this.configService.getOrThrow<string>('MINIO_ENDPOINT')
    const host = endpoint.replace(/^https?:\/\//, '').split(':')[0]
    const port = parseInt(endpoint.match(/:(\d+)$/)?.[1] ?? '9000', 10)
    const useSSL = endpoint.startsWith('https')

    this.minioClient = new MinioClient({
      endPoint: host,
      port,
      useSSL,
      accessKey: this.configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.getOrThrow<string>('MINIO_SECRET_KEY'),
    })

    this.bucket = this.configService.getOrThrow<string>('MINIO_BUCKET')
  }

  async onModuleInit(): Promise<void> {
    await this.ensureBucket().catch((error: unknown) => {
      this.logger.error(`Startup bucket init failed: ${String(error)}`)
    })
  }

  async processRecording(
    recordingPath: string,
    streamId: string,
    channelId: string,
  ): Promise<ProcessRecordingResult> {
    const outputDir = join(this.tmpDir, streamId)
    const objectPrefix = `${channelId}/${streamId}`

    this.logger.log(`Processing recording ${recordingPath} for stream ${streamId}`)

    try {
      const duration = await this.getVideoDuration(recordingPath)
      this.logger.log(`Duration: ${String(duration)}s`)

      await this.convertToHls(recordingPath, outputDir)
      this.logger.log('HLS conversion complete')

      let posterUrl: string | null = null
      try {
        await this.extractPoster(recordingPath, outputDir, duration)
        posterUrl = `${objectPrefix}/poster.webp`
      } catch (posterError) {
        this.logger.warn(
          `Poster extraction failed, continuing without poster: ${(posterError as Error).message}`,
        )
      }

      await this.uploadDirectoryToMinio(outputDir, objectPrefix)
      this.logger.log(`Uploaded to MinIO: ${objectPrefix}/`)

      await rm(outputDir, { recursive: true, force: true })
      await unlink(recordingPath).catch(() => {})
      this.logger.log('Cleanup complete')

      return { duration, posterUrl }
    } catch (error) {
      await rm(outputDir, { recursive: true, force: true }).catch(() => {})
      throw error
    }
  }

  private async getVideoDuration(filePath: string): Promise<number> {
    try {
      const { stdout } = await execFileAsync('ffprobe', [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        filePath,
      ])
      return Math.round(parseFloat(stdout.trim()) || 0)
    } catch {
      return 0
    }
  }

  private async convertToHls(inputPath: string, outputDir: string): Promise<void> {
    await mkdir(outputDir, { recursive: true })

    await execFileAsync('ffmpeg', [
      '-i',
      inputPath,
      '-c',
      'copy',
      '-f',
      'hls',
      '-hls_time',
      '6',
      '-hls_playlist_type',
      'vod',
      '-hls_segment_type',
      'fmp4',
      '-hls_fmp4_init_filename',
      join(outputDir, 'init.mp4'),
      '-hls_segment_filename',
      join(outputDir, 'segment_%03d.m4s'),
      join(outputDir, 'playlist.m3u8'),
    ])
  }

  private async extractPoster(
    inputPath: string,
    outputDir: string,
    duration: number,
  ): Promise<void> {
    const posterTime = Math.max(10, Math.floor(duration * 0.25))
    const posterPath = join(outputDir, 'poster.webp')

    await execFileAsync('ffmpeg', [
      '-i',
      inputPath,
      '-ss',
      String(posterTime),
      '-vframes',
      '1',
      '-c:v',
      'libwebp',
      '-quality',
      '90',
      posterPath,
    ])

    this.logger.log(`Poster extracted at ${String(posterTime)}s`)
  }

  private async uploadDirectoryToMinio(localDir: string, objectPrefix: string): Promise<void> {
    const files = await readdir(localDir)

    for (const file of files) {
      const filePath = join(localDir, file)
      const fileStat = await stat(filePath)

      if (!fileStat.isFile()) continue

      const ext = file.substring(file.lastIndexOf('.')).toLowerCase()
      const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream'
      const objectName = `${objectPrefix}/${file}`

      await this.minioClient.putObject(
        this.bucket,
        objectName,
        createReadStream(filePath),
        fileStat.size,
        { 'Content-Type': contentType },
      )
    }
  }

  private async ensureBucket(): Promise<void> {
    const exists = await this.minioClient.bucketExists(this.bucket).catch(() => false)

    if (!exists) {
      await this.minioClient.makeBucket(this.bucket)
      this.logger.log(`Bucket '${this.bucket}' created`)

      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucket}/*`],
          },
        ],
      }

      await this.minioClient.setBucketPolicy(this.bucket, JSON.stringify(policy))
      this.logger.log(`Bucket '${this.bucket}' set to public`)
    }
  }
}
