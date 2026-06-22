import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { UpdateUserColorInput } from './dto/update-user-color.input'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  updateUserColor(@CurrentUser('sub') userId: string, @Args('input') input: UpdateUserColorInput) {
    return this.userService.updateUserColor(userId, input.color)
  }
}
