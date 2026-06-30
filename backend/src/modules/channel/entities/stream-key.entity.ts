import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StreamKey {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  streamKey!: string
}
