import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Category } from './category.entity'

@ObjectType()
export class Channel {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => Category)
  category!: Category

  @Field(() => [String], { nullable: true })
  tags!: string[]

  @Field()
  isLive!: boolean

  @Field()
  userId!: string

  @Field(() => Boolean)
  isFollowing!: boolean

  @Field()
  username!: string
}
