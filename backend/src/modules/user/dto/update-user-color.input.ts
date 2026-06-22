import { Field, InputType } from '@nestjs/graphql'

import { USERNAME_COLORS } from '../constants/username-colors.constant'
import { IsIn, IsString } from 'class-validator'

@InputType()
export class UpdateUserColorInput {
  @Field()
  @IsString()
  @IsIn(USERNAME_COLORS, { message: 'Invalid username color' })
  color!: string
}
