import { Injectable } from '@nestjs/common'

import { hash } from 'argon2'
import { randomBytes } from 'node:crypto'
import { PrismaService } from '~/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } })
  }

  async findByUsername(username: string) {
    return this.prismaService.user.findUnique({ where: { username } })
  }

  async findById(id: string) {
    return this.prismaService.user.findUnique({ where: { id } })
  }

  async create(email: string, password: string, username: string) {
    const hashedPassword = await hash(password)

    const justChatting = await this.prismaService.category.upsert({
      where: {
        title: 'Just Chatting',
      },
      update: {},
      create: {
        title: 'Just Chatting',
        slug: 'just-chatting',
      },
    })

    return await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        channel: {
          create: {
            title: `${username}'s channel`,
            categoryId: justChatting.id,
            streamKey: this.generateStreamKey(),
          },
        },
      },
    })
  }

  async updateUserColor(userId: string, color: string) {
    return await this.prismaService.user.update({
      where: { id: userId },
      data: { color },
      omit: { password: true },
    })
  }

  generateStreamKey() {
    return `live_${randomBytes(20).toString('hex')}`
  }
}
