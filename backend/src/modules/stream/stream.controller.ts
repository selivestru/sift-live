import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common'

import { Public } from '../auth/decorators/public.decorator'

@Controller('stream')
export class StreamController {
  @Public()
  @Post('auth')
  @HttpCode(HttpStatus.OK)
  async auth(@Body() body: any) {
    console.debug(`Получен запрос на авторизацию стрима. Данные: ${JSON.stringify(body, null, 2)}`)

    console.log('action', body.action)

    const streamKey = body.path.split('/').pop()

    const isValidKey = streamKey === 'test'

    if (!isValidKey) {
      console.debug(`Попытка стрима с неверным ключом: ${streamKey}`)
      throw new UnauthorizedException('Invalid stream key')
    }

    console.debug(`Стрим успешно авторизован: ${streamKey}`)
    return { status: 'success' }
  }
}
