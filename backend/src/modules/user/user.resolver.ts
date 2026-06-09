import { Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Public } from '../auth/decorators/public.decorator'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Query(() => String)
  public() {
    return 'HI'
  }

  @Query(() => String)
  private(@CurrentUser() user: any) {
    return user.email
  }
}
