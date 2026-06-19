import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Channel {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => String, { nullable: true })
  category?: string | null

  @Field(() => [String], { nullable: true })
  tags!: string[]

  @Field()
  isLive!: boolean

  @Field()
  userId!: string

  @Field(() => Boolean)
  isFollowing!: boolean
}
